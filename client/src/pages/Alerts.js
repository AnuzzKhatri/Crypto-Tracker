import React, { useState, useEffect } from 'react';
import { Plus, Bell, BellOff, Trash2, Edit3, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    coinId: '',
    symbol: '',
    targetPrice: '',
    condition: 'above',
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/alerts', formData);
      toast.success('Alert created successfully!');
      setShowAddForm(false);
      setFormData({ coinId: '', symbol: '', targetPrice: '', condition: 'above' });
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create alert');
    }
  };

  const handleUpdateAlert = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/alerts/${editingAlert._id}`, {
        targetPrice: formData.targetPrice,
        condition: formData.condition,
      });
      toast.success('Alert updated successfully!');
      setEditingAlert(null);
      setFormData({ coinId: '', symbol: '', targetPrice: '', condition: 'above' });
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
      toast.error('Failed to update alert');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`/api/alerts/${alertId}`);
        toast.success('Alert deleted successfully!');
        fetchAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
        toast.error('Failed to delete alert');
      }
    }
  };

  const toggleAlertStatus = async (alertId, isActive) => {
    try {
      await axios.put(`/api/alerts/${alertId}`, { isActive: !isActive });
      toast.success(`Alert ${!isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Failed to update alert status');
    }
  };

  const openEditForm = (alert) => {
    setEditingAlert(alert);
    setFormData({
      coinId: alert.coinId,
      symbol: alert.symbol,
      targetPrice: alert.targetPrice.toString(),
      condition: alert.condition,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(value);
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
              Price Alerts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get notified when your favorite cryptocurrencies hit target prices
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`alert-item ${
                alert.isActive ? 'alert-active' : 'alert-inactive'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {alert.symbol.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {alert.symbol.toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alert.coinId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.condition === 'above' ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.condition === 'above' ? 'Above' : 'Below'}{' '}
                      {formatCurrency(alert.targetPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAlertStatus(alert._id, alert.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      alert.isActive
                        ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={alert.isActive ? 'Deactivate alert' : 'Activate alert'}
                  >
                    {alert.isActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditForm(alert)}
                    className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                    title="Edit alert"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Created: {new Date(alert.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No alerts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first price alert to get notified when cryptocurrencies hit your target prices
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Alert
            </button>
          </div>
        )}

        {/* Add/Edit Alert Modal */}
        {(showAddForm || editingAlert) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingAlert ? 'Edit Alert' : 'Create Price Alert'}
              </h3>
              <form onSubmit={editingAlert ? handleUpdateAlert : handleAddAlert}>
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
                      disabled={!!editingAlert}
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
                      disabled={!!editingAlert}
                    />
                  </div>
                  <div>
                    <label className="form-label">Target Price (USD)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.targetPrice}
                      onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                      className="form-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Condition</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="form-input"
                    >
                      <option value="above">Price goes above</option>
                      <option value="below">Price goes below</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAlert(null);
                      setFormData({ coinId: '', symbol: '', targetPrice: '', condition: 'above' });
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {editingAlert ? 'Update' : 'Create'} Alert
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

export default Alerts;
