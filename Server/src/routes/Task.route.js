const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model.js');
const isAuthenticated = require('../middleware/TaskAuth.js');


// Create a new task
router.post('/create', isAuthenticated, async (req, res) => {
    try {
      const { title, description, priority, dueDate, checklist } = req.body;
      console.log("Received checklist:", checklist); // Log the received checklist data
      const userId = req.user._id;
      const newTask = new Task({ title, description, priority, dueDate, checklist, createdBy: userId });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// // Get all tasks

  router.get('/getAlltask', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user._id;
      const tasks = await Task.find({ createdBy: userId });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


router.get('/gettask/:id', async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
 
//Share a Task with Other Users
router.post('/tasks/:id/share', isAuthenticated, async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      // Generate a shareable link
      const backendShareableLink = `${req.protocol}://${req.get('host')}/api/taskList/tasks/${taskId}`;
      const frontendShareableLink = `http://localhost:3000/tasks/share/${taskId}`; // Modify this with your frontend route
      
      // Store share links in task model
      task.shareLink = backendShareableLink;
      await task.save();
  
      res.json({ message: 'Task shared successfully', backendShareableLink, frontendShareableLink });
    } catch (error) {
      console.error('Error sharing task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });




// Update a task
router.put('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;
    const { title, description, priority, dueDate, checklist, sharedWith  } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: userId },
      { title, description, priority, dueDate, checklist, sharedWith },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or user not authorized' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a task
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or user not authorized' });
    }
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/analytics', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Call the function to calculate analytics data
    const analyticsData = await calculateAnalyticsData(userId);
    
    // Send the analytics data as a response
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

   
  router.get('/tasks/today', isAuthenticated, async (req, res) => {
    try {
        console.log('Request Parameters:', req.query);
        const userId = req.user._id;

        // Get the start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Get the end of today
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        console.log('Start of today:', startOfToday);
        console.log('End of today:', endOfToday);

        // Query tasks where the createdBy field matches the user ID
        // and the createdAt date falls within the range of today
        const tasks = await Task.find({ createdBy: userId, createdAt: { $gte: startOfToday, $lte: endOfToday } });

        console.log('Tasks created today:', tasks);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks created today:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Filter Tasks by This Week
router.get('/tasks/week', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        const tasks = await Task.find({ createdBy: userId, dueDate: { $gte: startOfWeek, $lte: endOfWeek } });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks for this week:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Filter Tasks by This Month
router.get('/tasks/month', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);
        const tasks = await Task.find({ createdBy: userId, dueDate: { $gte: startOfMonth, $lte: endOfMonth } });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks for this month:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/move/:taskId', isAuthenticated, async (req, res) => {
  try {
    const { newState } = req.body;
    const { taskId } = req.params;

    // Update task's state in the database
    await Task.findByIdAndUpdate(taskId, { state: newState });

    // Recalculate analytics data
    const userId = req.user._id;
    const analyticsData = await calculateAnalyticsData(userId);

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to calculate analytics data
async function calculateAnalyticsData(userId) {
  try {
    const totalTasks = await Task.countDocuments({ createdBy: userId });
    const todoTasks = await Task.countDocuments({ createdBy: userId, state: 'Todo' });
    const backlogTasks = await Task.countDocuments({ createdBy: userId, state: 'Backlog' });
    const inProgressTasks = await Task.countDocuments({ createdBy: userId, state: 'In Progress' });
    const completedTasks = await Task.countDocuments({ createdBy: userId, state: 'Done' });
    const lowPriorityTasks = await Task.countDocuments({ createdBy: userId, priority: 'Low' });
    const moderatePriorityTasks = await Task.countDocuments({ createdBy: userId, priority: 'Medium' });
    const highPriorityTasks = await Task.countDocuments({ createdBy: userId, priority: 'High' });
    const dueDateTasks = await Task.countDocuments({ createdBy: userId, dueDate: { $exists: true } });
    
    const analyticsData = {
      totalTasks,
      todoTasks,
      backlogTasks,
      inProgressTasks,
      completedTasks,
      lowPriorityTasks,
      moderatePriorityTasks,
      highPriorityTasks,
      dueDateTasks
    };
    
    return analyticsData;
  } catch (error) {
    console.error('Error calculating analytics data:', error);
    throw new Error('Error calculating analytics data');
  }
}


module.exports = router;
