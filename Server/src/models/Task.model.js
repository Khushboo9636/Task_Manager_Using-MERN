const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
  },
  checklist: [{
    item: {
      type: String,
      required: true
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  }],
  state: {
    type: String,
    enum: ['Backlog', 'Todo', 'In Progress', 'Done'],
    default: 'Todo'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  taskList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskList'
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
