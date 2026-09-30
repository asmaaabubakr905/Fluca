const express = require('express');
const Rating = require('../models/Rating');
const Trip = require('../models/Trip');
const auth = require('../middlewares/auth');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

// Submit a rating (Passenger)
router.post('/', auth, ratingController.submitRating);

// Get ratings for a captain
router.get('/captain/:captainId', ratingController.getRatingsForCaptain);

module.exports = router; 