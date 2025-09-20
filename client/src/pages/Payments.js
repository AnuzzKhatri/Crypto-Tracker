import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payments = () => {
  const [wallet, setWallet] = useState({ balance: 0, currency: 'INR' });
  const [loading, setLoading] = useState(true);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payments/wallet');
      setWallet(response.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('Failed to fetch wallet balance');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await axios.post('/api/payments/create-order', {
        amount: formData.amount,
        currency: formData.currency,
      });

      const { order, key } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'Crypto Tracker',
        description: 'Wallet Top-up',
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: formData.amount,
            });

            toast.success('Payment successful! Wallet topped up.');
            setShowTopUpForm(false);
            setFormData({ amount: '', currency: 'INR' });
            fetchWallet();
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Top-up error:', error);
      toast.error('Failed to process top-up');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await axios.post('/api/payments/withdraw', {
        amount: formData.amount,
      });

      toast.success('Withdrawal successful!');
      setShowWithdrawForm(false);
      setFormData({ amount: '', currency: 'INR' });
      fetchWallet();
    } catch (error) {
      console.error('Withdrawal error:', error);
      const message = error.response?.data?.message || 'Failed to process withdrawal';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (value, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payments & Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your wallet balance and make secure payments
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="crypto-card">
            <div className="flex items-center">
              <Wallet className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              <ArrowUpCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
              </div>
            </div>
          </div>
          <div className="crypto-card">
            <div className="flex items-center">
              <ArrowDownCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹0.00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="crypto-card">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Top Up Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add funds to your wallet using secure UPI payments
              </p>
              <button
                onClick={() => setShowTopUpForm(true)}
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Top Up Now
              </button>
            </div>
          </div>
          <div className="crypto-card">
            <div className="text-center">
              <ArrowDownCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Withdraw Funds
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Withdraw funds from your wallet to your bank account
              </p>
              <button
                onClick={() => setShowWithdrawForm(true)}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Withdraw Now
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="crypto-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Supported Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">UPI</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">UPI Payments</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instant transfers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">₹</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Indian Rupee</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">INR support</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">$</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">US Dollar</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">USD support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Up Modal */}
        {showTopUpForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Up Wallet
              </h3>
              <form onSubmit={handleTopUp}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="form-input"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="form-input"
                    >
                      <option value="INR">Indian Rupee (INR)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTopUpForm(false);
                      setFormData({ amount: '', currency: 'INR' });
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Withdraw Funds
              </h3>
              <form onSubmit={handleWithdraw}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={wallet.balance}
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="form-input"
                      placeholder="Enter amount"
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Available balance: {formatCurrency(wallet.balance, wallet.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawForm(false);
                      setFormData({ amount: '', currency: 'INR' });
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Withdraw'
                    )}
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

export default Payments;
