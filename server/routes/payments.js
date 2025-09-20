const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, [
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('currency').optional().isIn(['INR', 'USD']).withMessage('Currency must be INR or USD')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency = 'INR' } = req.body;

    // In a real application, you would integrate with Razorpay here
    // For now, we'll simulate the order creation
    const order = {
      id: `order_${Date.now()}`,
      amount: Math.round(parseFloat(amount) * 100), // Convert to paise/cents
      currency: currency,
      receipt: `receipt_${req.user._id}_${Date.now()}`,
      status: 'created',
      created_at: Date.now()
    };

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID // This would be your Razorpay key
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify payment and update wallet
// @access  Private
router.post('/verify', auth, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('signature').notEmpty().withMessage('Signature is required'),
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentId, signature, amount } = req.body;

    // In a real application, you would verify the Razorpay signature here
    // For now, we'll simulate successful verification
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update user wallet
    const user = await User.findById(req.user._id);
    user.wallet.balance += parseFloat(amount);
    await user.save();

    res.json({
      message: 'Payment verified successfully',
      wallet: {
        balance: user.wallet.balance,
        currency: user.wallet.currency
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

// @route   GET /api/payments/wallet
// @desc    Get user wallet balance
// @access  Private
router.get('/wallet', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');
    res.json(user.wallet);
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Failed to fetch wallet balance' });
  }
});

// @route   POST /api/payments/withdraw
// @desc    Withdraw from wallet
// @access  Private
router.post('/withdraw', auth, [
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount } = req.body;

    const user = await User.findById(req.user._id);
    
    if (user.wallet.balance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.wallet.balance -= parseFloat(amount);
    await user.save();

    res.json({
      message: 'Withdrawal successful',
      wallet: {
        balance: user.wallet.balance,
        currency: user.wallet.currency
      }
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Failed to process withdrawal' });
  }
});

module.exports = router;
