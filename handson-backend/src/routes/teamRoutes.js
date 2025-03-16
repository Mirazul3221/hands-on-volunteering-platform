const express = require('express');
const router = express.Router();
const {getAllTeams,createTeam,joinTeam} = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all teams
router.get('/', getAllTeams);

// Create a new team
router.post('/create', authMiddleware, createTeam);

// Join a team
router.post('/join/:teamId', authMiddleware, joinTeam);

module.exports = router;
