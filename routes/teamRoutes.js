const express = require('express');
const teamRouter = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  createTeam,
  inviteMember,
  getMyTeams
} = require('../controllers/teamController');

teamRouter.post('/', authenticateToken, createTeam);
teamRouter.post('/:teamId/invite/:userId', authenticateToken, inviteMember);
teamRouter.get('/my-teams', authenticateToken, getMyTeams);

module.exports = teamRouter; 