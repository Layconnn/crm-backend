const Task = require('../models/tasks');

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

// Export Controller Functions
module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
