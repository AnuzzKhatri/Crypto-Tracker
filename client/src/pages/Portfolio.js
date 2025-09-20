import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3, Trash2, Edit3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [formData, setFormData] = useState({
    coinId: '',
    symbol: '',
    name: '',
    amount: '',
    buyPrice: '',
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/portfolio');
      setPortfolio(response.data.portfolio);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/portfolio', formData);
      toast.success('Coin added to portfolio successfully!');
      setShowAddForm(false);
      setFormData({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });
      fetchPortfolio();
    } catch (error) {
      console.error('Error adding coin:', error);
      toast.error('Failed to add coin to portfolio');
    }
  };

  const handleUpdateCoin = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/portfolio/${editingCoin.coinId}`, {
        amount: formData.amount,
        buyPrice: formData.buyPrice,
      });
      toast.success('Portfolio updated successfully!');
      setEditingCoin(null);
      setFormData({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });
      fetchPortfolio();
    } catch (error) {
      console.error('Error updating coin:', error);
      toast.error('Failed to update portfolio');
    }
  };

  const handleDeleteCoin = async (coinId) => {
    if (window.confirm('Are you sure you want to remove this coin from your portfolio?')) {
      try {
        await axios.delete(`/api/portfolio/${coinId}`);
        toast.success('Coin removed from portfolio successfully!');
        fetchPortfolio();
      } catch (error) {
        console.error('Error deleting coin:', error);
        toast.error('Failed to remove coin from portfolio');
      }
    }
  };

  const openEditForm = (coin) => {
    setEditingCoin(coin);
    setFormData({
      coinId: coin.coinId,
      symbol: coin.symbol,
      name: coin.name,
      amount: coin.amount.toString(),
      buyPrice: coin.buyPrice.toString(),
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your cryptocurrency investments and performance
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Coin
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="crypto-card">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summary.totalValue || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              {summary.totalProfitLoss >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500 mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  summary.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatCurrency(summary.totalProfitLoss || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">P&L %</p>
                <p className={`text-2xl font-bold ${
                  summary.totalProfitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(summary.totalProfitLossPercentage || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Holdings ({portfolio.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Coin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Buy Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {portfolio.map((coin) => (
                  <tr key={coin.coinId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {coin.symbol.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {coin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {coin.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {coin.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(coin.buyPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(coin.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(coin.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className={`font-medium ${
                          coin.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatCurrency(coin.profitLoss)}
                        </span>
                        <span className={`text-xs ${
                          coin.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatPercentage(coin.profitLossPercentage)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(coin)}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoin(coin.coinId)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {portfolio.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                Your portfolio is empty
              </p>
              <p className="text-gray-400 dark:text-gray-500 mb-6">
                Start building your portfolio by adding your first cryptocurrency
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Coin
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Coin Modal */}
        {(showAddForm || editingCoin) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingCoin ? 'Edit Coin' : 'Add Coin to Portfolio'}
              </h3>
              <form onSubmit={editingCoin ? handleUpdateCoin : handleAddCoin}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Coin ID</label>
                    <input
                      type="text"
                      value={formData.coinId}
                      onChange={(e) => setFormData({ ...formData, coinId: e.target.value })}
                      className="form-input"
                      placeholder="e.g., bitcoin"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Symbol</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      className="form-input"
                      placeholder="e.g., BTC"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Bitcoin"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="form-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Buy Price (USD)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                      className="form-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCoin(null);
                      setFormData({ coinId: '', symbol: '', name: '', amount: '', buyPrice: '' });
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {editingCoin ? 'Update' : 'Add'} Coin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
