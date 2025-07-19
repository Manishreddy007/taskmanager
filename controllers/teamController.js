const Team = require('../models/teamModel');

const createTeam = async (req, res) => {
  try {
    const { teamName, teamDescription } = req.body;
    const teamOwner = req.user.id;

    const newTeam = await Team.create({
      teamName,
      teamDescription,
      owner: teamOwner,
      teamMembers: [{
        user: teamOwner,
        role: 'admin'
      }]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Team created successfully', 
      data: { team: newTeam }
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }

    // Check if user is already a member
    const isAlreadyMember = team.teamMembers.some(member => 
      member.user.toString() === userId
    );
    
    if (isAlreadyMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already a team member' 
      });
    }

    // Add new member
    team.teamMembers.push({
      user: userId,
      role: 'member'
    });
    
    await team.save();

    res.json({ 
      success: true, 
      message: 'User invited to team successfully', 
      data: { team }
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    const userTeams = await Team.find({ 
      'teamMembers.user': currentUserId,
      isActive: true 
    }).populate('teamMembers.user', 'username email profile.firstName profile.lastName');

    res.json({ 
      success: true, 
      data: { 
        teams: userTeams,
        count: userTeams.length 
      }
    });
  } catch (error) {
    console.error('Get my teams error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  createTeam,
  inviteMember,
  getMyTeams
}; 