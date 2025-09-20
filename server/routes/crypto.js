const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/crypto/prices
// @desc    Get cryptocurrency prices
// @access  Public
router.get('/prices', async (req, res) => {
  try {
    const { vs_currency = 'usd', order = 'market_cap_desc', per_page = 100, page = 1 } = req.query;
    
    const response = await axios.get(`${process.env.COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency,
        order,
        per_page,
        page,
        sparkline: false,
        price_change_percentage: '1h,24h,7d'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Crypto prices error:', error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrency prices' });
  }
});

// @route   GET /api/crypto/coin/:id
// @desc    Get specific coin details
// @access  Public
router.get('/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vs_currency = 'usd' } = req.query;

    const response = await axios.get(`${process.env.COINGECKO_API_URL}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    });

    const coinData = {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      image: response.data.image,
      current_price: response.data.market_data.current_price[vs_currency],
      market_cap: response.data.market_data.market_cap[vs_currency],
      total_volume: response.data.market_data.total_volume[vs_currency],
      price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
      price_change_percentage_7d: response.data.market_data.price_change_percentage_7d_in_currency[vs_currency],
      high_24h: response.data.market_data.high_24h[vs_currency],
      low_24h: response.data.market_data.low_24h[vs_currency],
      description: response.data.description.en
    };

    res.json(coinData);
  } catch (error) {
    console.error('Coin details error:', error);
    res.status(500).json({ message: 'Failed to fetch coin details' });
  }
});

// @route   GET /api/crypto/search
// @desc    Search cryptocurrencies
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await axios.get(`${process.env.COINGECKO_API_URL}/search`, {
      params: { query }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Crypto search error:', error);
    res.status(500).json({ message: 'Failed to search cryptocurrencies' });
  }
});

// @route   GET /api/crypto/trending
// @desc    Get trending cryptocurrencies
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.COINGECKO_API_URL}/search/trending`);
    res.json(response.data);
  } catch (error) {
    console.error('Trending crypto error:', error);
    res.status(500).json({ message: 'Failed to fetch trending cryptocurrencies' });
  }
});

// @route   GET /api/crypto/global
// @desc    Get global crypto market data
// @access  Public
router.get('/global', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.COINGECKO_API_URL}/global`);
    res.json(response.data);
  } catch (error) {
    console.error('Global crypto data error:', error);
    res.status(500).json({ message: 'Failed to fetch global crypto data' });
  }
});

module.exports = router;
