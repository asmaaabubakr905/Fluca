const Rating = require('../models/Rating');
const Trip = require('../models/Trip');

// Submit a rating (Passenger)
async function submitRating(req, res) {
  try {
    if (req.user.role !== 'Passenger') {
      return res.status(403).json({ message: 'Only passengers can submit ratings' });
    }
    const { tripId, rating, review } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    // Prevent duplicate ratings
    const existing = await Rating.findOne({ trip: tripId, passenger: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already rated this trip' });
    }
    const newRating = new Rating({
      trip: tripId,
      passenger: req.user.id,
      captain: trip.captain,
      rating,
      review,
    });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Get ratings for a captain
async function getRatingsForCaptain(req, res) {
  try {
    const ratings = await Rating.find({ captain: req.params.captainId }).populate('passenger', 'name');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  submitRating,
  getRatingsForCaptain,
}; 