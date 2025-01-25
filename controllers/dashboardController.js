const express = require("express");
const Task = require("../models/tasks");
const Contact = require("../models/contacts");
const mongoose = require("mongoose");

const paginateArray = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  return {
    data: array.slice(startIndex, startIndex + parseInt(limit, 10)),
    totalCount: array.length,
    totalPages: Math.ceil(array.length / limit),
    currentPage: parseInt(page, 10),
  };
};

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private (User must be authenticated)
const getDashboardData = async (req, res) => {
  try {
    // Fetch counts from the database, now filtered by the user
    const taskCount = await Task.countDocuments({ user: req.user.id });
    const completedTaskCount = await Task.countDocuments({
      user: req.user.id,
      status: "Completed",
    });
    const contactCount = await Contact.countDocuments({ user: req.user.id });
    const highPriorityTaskCount = await Task.countDocuments({
      user: req.user.id,
      priority: "High",
    });

    // Send response
    res.status(200).json({
      taskCount,
      completedTaskCount,
      contactCount,
      highPriorityTaskCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get total counts for tasks and contacts
// @route GET /api/dashboard/total-counts
// @access Private (User must be authenticated)
const getTotalCounts = async (req, res) => {
  try {
    const taskCount = await Task.countDocuments({ user: req.user.id });
    const contactCount = await Contact.countDocuments({ user: req.user.id });

    res.status(200).json({
      tasks: taskCount,
      contacts: contactCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get task summary by status
// @route GET /api/dashboard/task-summary/status
// @access Private (User must be authenticated)
const getTaskSummaryByStatus = async (req, res) => {
  try {
    const summary = await Task.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) }, // Convert string to ObjectId
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get task summary by priority
// @route GET /api/dashboard/task-summary/priority
// @access Private (User must be authenticated)
const getTaskSummaryByPriority = async (req, res) => {
  try {
    const summary = await Task.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) }, // Convert string to ObjectId
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get recent activity (tasks and contacts)
// @route GET /api/dashboard/recent-activity
// @access Private (User must be authenticated)
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;

    // Parse limit and page values
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    // Fetch recent tasks
    const recentTasks = await Task.find(
      { user: req.user.id },
      "title updatedAt status priority dueDate description"
    )
      .sort({ updatedAt: -1 })
      .lean()
      .exec()
      .then((tasks) => tasks.map((task) => ({ ...task, type: "task" })));

    // Fetch recent contacts
    const recentContacts = await Contact.find(
      { user: req.user.id },
      "firstName lastName email phone company notes updatedAt"
    )
      .sort({ updatedAt: -1 })
      .lean()
      .exec()
      .then((contacts) =>
        contacts.map((contact) => ({ ...contact, type: "contact" }))
      );

    // console.log("Recent Tasks:", recentTasks);
    // console.log("Recent Contacts:", recentContacts);

    // Merge and sort activities
    const allActivities = [...recentTasks, ...recentContacts].sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );

    // console.log("All Activities (merged):", allActivities);

    // Paginate results
    const paginatedActivities = paginateArray(allActivities, parsedPage, parsedLimit);

    // Log the paginated activities
    // console.log("Paginated Activities:", paginatedActivities);

    res.status(200).json(paginatedActivities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// @desc Get upcoming deadlines
// @route GET /api/dashboard/upcoming-deadlines
// @access Private (User must be authenticated)
const getUpcomingDeadlines = async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;

    // Convert to integers and validate (already checked by middleware)
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    // Fetch tasks with future deadlines for the user
    const tasksWithDeadlines = await Task.find(
      { user: req.user.id, dueDate: { $gte: new Date() } },
      "title dueDate priority"
    )
      .sort({ dueDate: 1 })
      .lean()
      .exec();

    // Paginate results
    const { data, totalCount, totalPages, currentPage } = paginateArray(
      tasksWithDeadlines,
      parsedPage,
      parsedLimit
    );

    res.status(200).json({ data, totalCount, totalPages, currentPage });
  } catch (error) {
    console.error("Error fetching upcoming deadlines:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get Contact summary
// @routes GET /api/dashboard/contact-summary
// @access Private (User must be authenticated)
const getContactSummary = async (req, res) => {
  try {
    console.log("User ID:", req.user.id); // Verify user id
    const summary = await Contact.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) }, // Convert string to ObjectId
      },
      {
        $group: {
          _id: "$company", // Group by company
          count: { $sum: 1 }, // Count contacts in each company
          contacts: {
            $push: {
              firstName: "$firstName",
              lastName: "$lastName",
              notes: "$notes",
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the MongoDB ID field in the result
          company: "$_id", // Rename `_id` to `company`
          count: 1,
          contacts: 1,
        },
      },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching contact summary:", error);
    res.status(500).json({ message: "Error fetching contact summary", error });
  }
};

module.exports = {
  getDashboardData,
  getTotalCounts,
  getContactSummary,
  getTaskSummaryByStatus,
  getTaskSummaryByPriority,
  getRecentActivities,
  getUpcomingDeadlines,
};
