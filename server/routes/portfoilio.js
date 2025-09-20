const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('portfolio preferences');
    
    // Get current prices for all coins in portfolio
    const coinIds = user.portfolio.map(item => item.coinId).join(',');
    
    if (coinIds) {
      const response = await axios.get(`${process.env.COINGECKO_API_URL}/simple/price`, {
        params: {
          ids: coinIds,
          vs_currencies: user.preferences.currency || 'usd',
          include_24hr_change: true
        }
      });

      const portfolioWithPrices = user.portfolio.map(item => {
        const currentPrice = response.data[item.coinId]?.[user.preferences.currency || 'usd'] || 0;
        const priceChange24h = response.data[item.coinId]?.[`${user.preferences.currency || 'usd'}_24h_change`] || 0;
        
        return {
          ...item.toObject(),
          currentPrice,
          priceChange24h,
          totalValue: item.amount * currentPrice,
          profitLoss: (currentPrice - item.buyPrice) * item.amount,
          profitLossPercentage: ((currentPrice - item.buyPrice) / item.buyPrice) * 100
        };
      });

      const totalValue = portfolioWithPrices.reduce((sum, item) => sum + item.totalValue, 0);
      const totalProfitLoss = portfolioWithPrices.reduce((sum, item) => sum + item.profitLoss, 0);

      res.json({
        portfolio: portfolioWithPrices,
        summary: {
          totalValue,
          totalProfitLoss,
          totalProfitLossPercentage: totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0
        }
      });
    } else {
      res.json({
        portfolio: [],
        summary: {
          totalValue: 0,
          totalProfitLoss: 0,
          totalProfitLossPercentage: 0
        }
      });
    }
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

// @route   POST /api/portfolio
// @desc    Add coin to portfolio
// @access  Private
router.post('/', auth, [
  body('coinId').notEmpty().withMessage('Coin ID is required'),
  body('symbol').notEmpty().withMessage('Symbol is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('buyPrice').isNumeric().isFloat({ min: 0 }).withMessage('Buy price must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { coinId, symbol, name, amount, buyPrice } = req.body;

    // Check if coin already exists in portfolio
    const user = await User.findById(req.user._id);
    const existingCoin = user.portfolio.find(item => item.coinId === coinId);

    if (existingCoin) {
      // Update existing coin
      existingCoin.amount += parseFloat(amount);
      existingCoin.buyPrice = ((existingCoin.buyPrice * (existingCoin.amount - parseFloat(amount))) + (parseFloat(buyPrice) * parseFloat(amount))) / existingCoin.amount;
    } else {
      // Add new coin
      user.portfolio.push({
        coinId,
        symbol,
        name,
        amount: parseFloat(amount),
        buyPrice: parseFloat(buyPrice)
      });
    }

    await user.save();

    res.json({ message: 'Coin added to portfolio successfully' });
  } catch (error) {
    console.error('Add to portfolio error:', error);
    res.status(500).json({ message: 'Failed to add coin to portfolio' });
  }
});

// @route   PUT /api/portfolio/:coinId
// @desc    Update coin in portfolio
// @access  Private
router.put('/:coinId', auth, [
  body('amount').optional().isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('buyPrice').optional().isNumeric().isFloat({ min: 0 }).withMessage('Buy price must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { coinId } = req.params;
    const { amount, buyPrice } = req.body;

    const user = await User.findById(req.user._id);
    const coin = user.portfolio.find(item => item.coinId === coinId);

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found in portfolio' });
    }

    if (amount !== undefined) coin.amount = parseFloat(amount);
    if (buyPrice !== undefined) coin.buyPrice = parseFloat(buyPrice);

    await user.save();

    res.json({ message: 'Portfolio updated successfully' });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ message: 'Failed to update portfolio' });
  }
});

// @route   DELETE /api/portfolio/:coinId
// @desc    Remove coin from portfolio
// @access  Private
router.delete('/:coinId', auth, async (req, res) => {
  try {
    const { coinId } = req.params;

    const user = await User.findById(req.user._id);
    user.portfolio = user.portfolio.filter(item => item.coinId !== coinId);

    await user.save();

    res.json({ message: 'Coin removed from portfolio successfully' });
  } catch (error) {
    console.error('Remove from portfolio error:', error);
    res.status(500).json({ message: 'Failed to remove coin from portfolio' });
  }
});

module.exports = router;
