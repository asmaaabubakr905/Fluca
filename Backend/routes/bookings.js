const express = require('express');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const auth = require('../middlewares/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Book a trip (Passenger)
router.post('/', auth, bookingController.bookTrip);

// Get bookings for current passenger
router.get('/my', auth, bookingController.getMyBookings);

// Get bookings for trips owned by current driver
router.get('/driver', auth, bookingController.getDriverBookings);

module.exports = router; 