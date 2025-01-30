const TaskController = require('../controllers/taskController');
const ContactController = require('../controllers/contactController');
const SalesController = require('../controllers/salesOpportunityController');

// @desc    Get all analytics data (task, contact, and sales)
exports.getAnalyticsData = async (req, res) => {
  try {
    console.log("Fetching Analytics for User:", req.user.id);

    const [taskAnalytics, contactAnalytics, salesAnalytics] = await Promise.allSettled([
      TaskController.getTaskAnalytics(req),
      ContactController.getContactAnalytics(req),
      SalesController.getSalesAnalytics(req),
    ]);

    console.log("Task Analytics Response:", taskAnalytics);
    console.log("Contact Analytics Response:", contactAnalytics);
    console.log("Sales Analytics Response:", salesAnalytics);

    res.status(200).json({
      taskAnalytics: taskAnalytics.status === "fulfilled" ? taskAnalytics.value : {},
      contactAnalytics: contactAnalytics.status === "fulfilled" ? contactAnalytics.value : {},
      salesAnalytics: salesAnalytics.status === "fulfilled" ? salesAnalytics.value : {},
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};




// @desc    Get sales by date range
// @route   GET /api/analytics/sales-by-date-range
// @access  Private (User must be authenticated)
exports.getSalesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Please provide both startDate and endDate' });
  }

  try {
    const salesData = await SalesController.getSalesByDateRange(startDate, endDate);
    res.status(200).json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sales data by date range' });
  }
};

// @desc    Get active users
// @route   GET /api/analytics/active-users
// @access  Private (User must be authenticated)
exports.getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await SalesController.getActiveUsers();
    res.status(200).json(activeUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching active users' });
  }
};

// @desc    Get sales pipeline summary
// @route   GET /api/analytics/sales-pipeline-summary
// @access  Private (User must be authenticated)
exports.getSalesPipelineSummary = async (req, res) => {
  try {
    const salesSummary = await SalesController.getSalesPipelineSummary();
    res.status(200).json(salesSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sales pipeline summary' });
  }
};
