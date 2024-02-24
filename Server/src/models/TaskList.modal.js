const mongoose = require('mongoose');

const taskListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const TaskList = mongoose.model('TaskList', taskListSchema);

module.exports = TaskList;
