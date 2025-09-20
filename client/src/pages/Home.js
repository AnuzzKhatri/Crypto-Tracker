import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Shield, Zap } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [marketData, setMarketData] = useState(null);
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [globalResponse, coinsResponse] = await Promise.all([
          axios.get('/api/crypto/global'),
          axios.get('/api/crypto/prices?per_page=10')
        ]);

        setMarketData(globalResponse.data.data);
        setTopCoins(coinsResponse.data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Tracking',
      description: 'Monitor cryptocurrency prices with live updates and market data.',
    },
    {
      icon: BarChart3,
      title: 'Portfolio Management',
      description: 'Track your investments and calculate profits/losses automatically.',
    },
    {
      icon: Zap,
      title: 'Price Alerts',
      description: 'Get notified when your favorite cryptocurrencies hit target prices.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Make secure transactions with integrated Razorpay UPI payments.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Track Crypto Like a Pro
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Comprehensive cryptocurrency tracking, portfolio management, and secure payments 
              all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/market"
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Explore Market
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/portfolio"
                    className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    View Portfolio
                  </Link>
                  <Link
                    to="/market"
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Browse Market
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      {marketData && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Market Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="crypto-card text-center">
                <DollarSign className="w-8 h-8 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(marketData.total_market_cap.usd)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Total Market Cap</p>
              </div>
              <div className="crypto-card text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(marketData.total_volume.usd)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">24h Volume</p>
              </div>
              <div className="crypto-card text-center">
                <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData.active_cryptocurrencies}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Active Cryptocurrencies</p>
              </div>
              <div className="crypto-card text-center">
                <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData.markets}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Markets</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Cryptocurrencies */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Top Cryptocurrencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {topCoins.map((coin) => (
              <Link
                key={coin.id}
                to={`/coin/${coin.id}`}
                className="crypto-card hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {coin.symbol.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {coin.name}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      coin.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/market"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              View All Cryptocurrencies
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Crypto Tracker?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Tracking?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users managing their crypto portfolios with confidence.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
