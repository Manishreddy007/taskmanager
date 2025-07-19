const express = require('express');
const userRouter = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/userControllers');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateToken, getUserProfile);
userRouter.put('/profile', authenticateToken, updateUserProfile);
userRouter.put('/change-password', authenticateToken, changePassword);

module.exports = userRouter; 