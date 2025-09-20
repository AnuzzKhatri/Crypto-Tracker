require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('⚠️ MongoDB connection failed (continuing without DB):', err.message));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Crypto Tracker API is running!'
  });
});

// Mock crypto data endpoint
app.get('/api/crypto/prices', async (req, res) => {
  try {
    // Mock data for testing
    const mockData = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 45000,
        market_cap: 850000000000,
        total_volume: 25000000000,
        price_change_percentage_24h: 2.5,
        market_cap_rank: 1
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3200,
        market_cap: 380000000000,
        total_volume: 15000000000,
        price_change_percentage_24h: -1.2,
        market_cap_rank: 2
      },
      {
        id: 'binancecoin',
        symbol: 'bnb',
        name: 'BNB',
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        current_price: 320,
        market_cap: 50000000000,
        total_volume: 2000000000,
        price_change_percentage_24h: 0.8,
        market_cap_rank: 3
      },
      {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        current_price: 0.45,
        market_cap: 15000000000,
        total_volume: 500000000,
        price_change_percentage_24h: 3.2,
        market_cap_rank: 4
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        current_price: 95,
        market_cap: 40000000000,
        total_volume: 3000000000,
        price_change_percentage_24h: -2.1,
        market_cap_rank: 5
      }
    ];
    
    res.json(mockData);
  } catch (error) {
    console.error('Crypto prices error:', error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrency prices' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Crypto data: http://localhost:${PORT}/api/crypto/prices`);
});
