// models/taskModel.js

const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure tasks are associated with a User model
    required: true,
  },
}, { timestamps: true }); // adds createdAt and updatedAt fields automatically

taskSchema.index({ updatedAt: -1 });
taskSchema.index({ dueDate: 1 });

// Export Task Model
module.exports = mongoose.model('Task', taskSchema);