const Team = require('../models/Team');
const User = require('../models/User');

// Fetch all teams (public and private teams)
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('createdBy', 'name')
      .populate('members', 'name email');
    
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teams', error });
  }
};

// Create a new team
exports.createTeam = async (req, res) => {
  const { name, description, isPublic } = req.body;
   console.log('hfgfgjhfg')
  try {
    const team = new Team({
      name,
      description,
      isPublic,
      createdBy: req.user.id,
    });

    await team.save();
    res.status(201).json({ success: true, message: 'Team created successfully!', team });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating team', error });
  }
};

// User joins a team
exports.joinTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const teamId = req.params.teamId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    // Check if the user is already a member
    if (team.members.includes(userId)) {
      return res.json({ success: true, message: "You are already a member of this team!", team });
    }

    // If the team is private, prevent unauthorized joining
    if (!team.isPublic) {
      return res.status(403).json({ success: false, message: "This is a private team. You need an invitation to join." });
    }

    // Add user to the team's members list
    team.members.push(userId);
    await team.save();

    // Update user's joined teams (if storing this in User schema)
    await User.findByIdAndUpdate(userId, {
      $push: { teamsJoined: teamId }
    });

    res.json({ success: true, message: "You joined the team!", team });

  } catch (error) {
    console.error("Error joining team:", error);
    res.status(500).json({ success: false, message: "Error joining team", error });
  }
};
