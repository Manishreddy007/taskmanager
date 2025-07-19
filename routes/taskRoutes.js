const express = require('express');
const taskRouter = express.Router();
const {
  createTask,
  updateTask,
  getMyTasks,
  filterTasks,
  searchTasks,
  addCommentToTask,
  getTaskComments
} = require('../controllers/taskController');
const { authenticateToken } = require('../middlewares/auth');

taskRouter.post('/task', authenticateToken, createTask);
taskRouter.put('/task/:id', authenticateToken, updateTask);
taskRouter.get('/my-tasks', authenticateToken, getMyTasks);
taskRouter.get('/filter', authenticateToken, filterTasks);
taskRouter.get('/search', authenticateToken, searchTasks);
taskRouter.post('/task/:id/comments', authenticateToken, addCommentToTask);
taskRouter.get('/task/:id/comments', authenticateToken, getTaskComments);

module.exports = taskRouter; 