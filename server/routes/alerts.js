const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get user alerts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('alerts');
    res.json(user.alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// @route   POST /api/alerts
// @desc    Create new alert
// @access  Private
router.post('/', auth, [
  body('coinId').notEmpty().withMessage('Coin ID is required'),
  body('symbol').notEmpty().withMessage('Symbol is required'),
  body('targetPrice').isNumeric().isFloat({ min: 0 }).withMessage('Target price must be a positive number'),
  body('condition').isIn(['above', 'below']).withMessage('Condition must be either "above" or "below"')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { coinId, symbol, targetPrice, condition } = req.body;

    const user = await User.findById(req.user._id);
    
    // Check if alert already exists
    const existingAlert = user.alerts.find(alert => 
      alert.coinId === coinId && 
      alert.targetPrice === parseFloat(targetPrice) && 
      alert.condition === condition &&
      alert.isActive
    );

    if (existingAlert) {
      return res.status(400).json({ message: 'Alert already exists for this price target' });
    }

    user.alerts.push({
      coinId,
      symbol,
      targetPrice: parseFloat(targetPrice),
      condition
    });

    await user.save();

    res.json({ message: 'Alert created successfully' });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

// @route   PUT /api/alerts/:alertId
// @desc    Update alert
// @access  Private
router.put('/:alertId', auth, [
  body('targetPrice').optional().isNumeric().isFloat({ min: 0 }).withMessage('Target price must be a positive number'),
  body('condition').optional().isIn(['above', 'below']).withMessage('Condition must be either "above" or "below"'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { alertId } = req.params;
    const { targetPrice, condition, isActive } = req.body;

    const user = await User.findById(req.user._id);
    const alert = user.alerts.id(alertId);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    if (targetPrice !== undefined) alert.targetPrice = parseFloat(targetPrice);
    if (condition !== undefined) alert.condition = condition;
    if (isActive !== undefined) alert.isActive = isActive;

    await user.save();

    res.json({ message: 'Alert updated successfully' });
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ message: 'Failed to update alert' });
  }
});

// @route   DELETE /api/alerts/:alertId
// @desc    Delete alert
// @access  Private
router.delete('/:alertId', auth, async (req, res) => {
  try {
    const { alertId } = req.params;

    const user = await User.findById(req.user._id);
    user.alerts = user.alerts.filter(alert => alert._id.toString() !== alertId);

    await user.save();

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
});

module.exports = router;
