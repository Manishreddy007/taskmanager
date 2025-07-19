const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  taskDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Task description cannot exceed 2000 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Due date is required']
  },
  taskStatus: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task creator is required']
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Task must belong to a team']
  },
  taskComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  files: [{
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    default: 0
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ taskTitle: 'text', taskDescription: 'text' });
taskSchema.index({ assignee: 1, taskStatus: 1 });
taskSchema.index({ team: 1, taskStatus: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ creator: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  if (this.taskStatus === 'completed') {
    return false;
  }
  return new Date() > this.deadline;
});

// Virtual for days until due
taskSchema.virtual('daysUntilDue').get(function() {
  if (this.taskStatus === 'completed') {
    return null;
  }
  const now = new Date();
  const due = new Date(this.deadline);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task; 