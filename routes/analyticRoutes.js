const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// @route   GET /api/analytics
// @desc    Get all analytics data (tasks and sales analytics)
// @access  Private (User must be authenticated)
router.get('/', analyticsController.getAnalyticsData);

// @route   GET /api/analytics/sales-by-date-range
// @desc    Get sales data by date range
// @access  Private (User must be authenticated)
router.get('/sales-by-date-range', analyticsController.getSalesByDateRange);

// @route   GET /api/analytics/active-users
// @desc    Get active users
// @access  Private (User must be authenticated)
router.get('/active-users', analyticsController.getActiveUsers);

// @route   GET /api/analytics/sales-pipeline-summary
// @desc    Get the sales pipeline summary
// @access  Private (User must be authenticated)
router.get('/sales-pipeline-summary', analyticsController.getSalesPipelineSummary);

module.exports = router;
