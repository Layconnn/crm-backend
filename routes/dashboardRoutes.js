const express = require("express");
const {
  getDashboardData,
  getRecentActivities,
  getUpcomingDeadlines,
  getTaskSummaryByStatus,
  getTaskSummaryByPriority,
  getContactSummary,
} = require("../controllers/dashboardController");
const validatePagination = require('../middleware/validatePagination');

const router = express.Router();

router.get("/summary", getDashboardData);
router.get("/recent-activity", validatePagination, getRecentActivities);
router.get("/upcoming-deadlines", validatePagination, getUpcomingDeadlines);
router.get("/tasks-summary/status", getTaskSummaryByStatus);
router.get("/tasks-summary/priority", getTaskSummaryByPriority);
router.get("/contacts-summary", getContactSummary);

module.exports = router;
