const Task = require('../models/tasks');
const mongoose = require('mongoose');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private (User must be authenticated)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }); // Filter tasks by logged-in user
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private (User must be authenticated)
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id }); // Ensure task belongs to user
  
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to view it' });
    }
  
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (User must be authenticated)
const createTask = async (req, res) => {
  const { title, status, description, dueDate, priority } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      priority,
      user: req.user.id, // Associate the task with the user
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (User must be authenticated)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // Ensure the task belongs to the user
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to update it' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (User must be authenticated)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Ensure the task belongs to the user

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Task Analytics
// @route   GET /api/task-analytics
// @access  Private (User must be authenticated)
const getTaskAnalytics = async (req) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // Ensure ObjectId

    const analytics = await Task.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          tasksByStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],

          tasksByPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ],

          taskCompletionRate: [
            {
              $group: {
                _id: null,
                completedTasks: {
                  $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                },
                totalTasks: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                completionRate: {
                  $cond: [
                    { $gt: ["$totalTasks", 0] },
                    { $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100] }, // Convert to percentage
                    0,
                  ],
                },
              },
            },
          ],

          tasksDistributionByUser: [
            {
              $group: {
                _id: "$user",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    console.log("Raw Task Analytics:", JSON.stringify(analytics, null, 2));

    const result = analytics[0];
    return {
      tasksByStatus: result.tasksByStatus ?? [],
      tasksByPriority: result.tasksByPriority ?? [],
      taskCompletionRate: result.taskCompletionRate?.[0]?.completionRate ?? 0,
      tasksDistributionByUser: result.tasksDistributionByUser ?? [],
    };
  } catch (error) {
    console.error("Error fetching task analytics:", error);
    throw new Error("Error fetching task analytics");
  }
};


// Export Controller Functions
module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskAnalytics, // Add the analytics function to exports
};
