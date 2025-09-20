import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, Calendar } from 'lucide-react';
import axios from 'axios';

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoinDetails();
  }, [id]);

  const fetchCoinDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/crypto/coin/${id}`);
      setCoin(response.data);
    } catch (error) {
      console.error('Error fetching coin details:', error);
      setError('Failed to fetch coin details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatNumber = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Coin not found'}
          </h1>
          <Link
            to="/market"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Market
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/market"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Market
        </Link>

        {/* Coin Header */}
        <div className="crypto-card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {coin.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {coin.symbol.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(coin.current_price)}
              </p>
              <div className="flex items-center space-x-2">
                {coin.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={`text-lg font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatPercentage(coin.price_change_percentage_24h)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">(24h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="crypto-card">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(coin.market_cap)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">24h Volume</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(coin.total_volume)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">24h High</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(coin.high_24h)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">24h Low</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(coin.low_24h)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Change Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="crypto-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Price Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">24h Change</span>
                <span
                  className={`font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatPercentage(coin.price_change_percentage_24h)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">7d Change</span>
                <span
                  className={`font-medium ${
                    coin.price_change_percentage_7d >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {formatPercentage(coin.price_change_percentage_7d)}
                </span>
              </div>
            </div>
          </div>

          <div className="crypto-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Market Data
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Market Cap Rank</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  #{coin.market_cap_rank || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Circulating Supply</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.circulating_supply ? `${coin.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {coin.description && (
          <div className="crypto-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About {coin.name}
            </h3>
            <div
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: coin.description }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            Add to Portfolio
          </Link>
          <Link
            to="/alerts"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors"
          >
            Set Price Alert
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
