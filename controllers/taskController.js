const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

const createTask = async (req, res) => {
  try {
    const { taskTitle, taskDescription, deadline, taskStatus, assignee, team } = req.body;
    
    if (!taskTitle) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task title is required' 
      });
    }
    
    // Validate assignee if provided
    if (assignee) {
      const validAssignee = await User.findById(assignee);
      if (!validAssignee) {
        return res.status(404).json({ 
          success: false, 
          message: 'Invalid assignee ID' 
        });
      }
    }
    
    const newTask = await Task.create({
      taskTitle,
      taskDescription,
      deadline,
      taskStatus,
      assignee,
      creator: req.user.id,
      lastModifiedBy: req.user.id,
      team
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Task created successfully',
      data: { task: newTask }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const currentUserId = req.user.id;
    const updateData = req.body;
    
    const allowedFields = ['taskTitle', 'taskDescription', 'deadline', 'taskStatus', 'assignee', 'team'];
    const restrictedFields = ['creator', 'lastModifiedBy', 'taskComments', 'files'];
    
    const updateFields = Object.keys(updateData);
    const hasRestrictedFields = updateFields.some(field => restrictedFields.includes(field));
    
    if (hasRestrictedFields) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot update creator, lastModifiedBy, comments, or files' 
      });
    }
    
    // Validate assignee if being updated
    if (updateData.assignee) {
      const validAssignee = await User.findById(updateData.assignee);
      if (!validAssignee) {
        return res.status(404).json({ 
          success: false, 
          message: 'Invalid assignee ID' 
        });
      }
    }
    
    const updates = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }
    updates.lastModifiedBy = currentUserId;
    
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const assignedTasks = await Task.find({ assignee: currentUserId, isArchived: false });
    
    if (assignedTasks.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No tasks assigned',
        data: { tasks: [] }
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Assigned tasks retrieved successfully',
      data: { tasks: assignedTasks }
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const filterTasks = async (req, res) => {
  try {
    const filterCriteria = req.query;
    const filteredTasks = await Task.find(filterCriteria);
    const resultCount = filteredTasks.length;
    
    res.json({ 
      success: true, 
      message: `${resultCount} tasks found`,
      data: { 
        tasks: filteredTasks,
        count: resultCount
      }
    });
  } catch (error) {
    console.error('Filter tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const searchTasks = async (req, res) => {
  try {
    const searchKeyword = req.query.q;
    
    if (!searchKeyword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query parameter "q" is required' 
      });
    }
    
    const searchResults = await Task.find({
      $text: { $search: searchKeyword }
    });
    
    res.json({ 
      success: true, 
      message: 'Search completed',
      data: { 
        tasks: searchResults,
        count: searchResults.length
      }
    });
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const addCommentToTask = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const commentText = req.body.commentContent;
    const taskId = req.params.id;
    
    if (!commentText || !taskId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task ID and comment content are required' 
      });
    }
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    const newComment = await Comment.create({
      taskId,
      commentAuthor: currentUserId,
      commentContent: commentText,
      team: task.team
    });
    
    await Task.findByIdAndUpdate(
      taskId,
      { $push: { taskComments: newComment._id } }
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Comment added successfully',
      data: { comment: newComment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const getTaskComments = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    if (!taskId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task ID is required' 
      });
    }
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    const taskComments = await Comment.find({ 
      taskId, 
      isDeleted: false 
    }).populate('commentAuthor', 'username email profile.firstName profile.lastName');
    
    res.json({ 
      success: true, 
      message: 'Comments retrieved successfully',
      data: { comments: taskComments }
    });
  } catch (error) {
    console.error('Get task comments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  createTask,
  updateTask,
  getMyTasks,
  filterTasks,
  searchTasks,
  addCommentToTask,
  getTaskComments
}; 