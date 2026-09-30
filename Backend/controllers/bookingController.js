const Booking = require('../models/Booking');
const Trip = require('../models/Trip');

// Book a trip (Passenger)
async function bookTrip(req, res) {
  try {
    if (req.user.role !== 'Passenger') {
      return res.status(403).json({ message: 'Only passengers can book trips' });
    }
    const { tripId, seats } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    // حساب المقاعد المتاحة ديناميكيًا
    const availableSeats = trip.seats - (trip.passengers ? trip.passengers.length : 0);
    if (availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }
    // Create booking
    const booking = new Booking({
      trip: tripId,
      passenger: req.user.id,
      seats,
      status: 'Confirmed',
    });
    await booking.save();
    // أضف الراكب بعدد المقاعد المطلوبة
    for (let i = 0; i < seats; i++) {
      trip.passengers.push(req.user.id);
    }
    // إذا الرحلة لم تبدأ بعد، غير حالتها إلى Started
    if (trip.status === 'Not Started') {
      trip.status = 'Started';
    }
    await trip.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Get bookings for current passenger
async function getMyBookings(req, res) {
  try {
    if (req.user.role !== 'Passenger') {
      return res.status(403).json({ message: 'Only passengers can view their bookings' });
    }
    const bookings = await Booking.find({ passenger: req.user.id }).populate('trip');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Get bookings for trips owned by current driver
async function getDriverBookings(req, res) {
  try {
    if (req.user.role !== 'Driver') {
      return res.status(403).json({ message: 'Only drivers can view their trip bookings' });
    }
    // Find trips by this driver
    const trips = await Trip.find({ captain: req.user.id });
    const tripIds = trips.map(t => t._id);
    const bookings = await Booking.find({ trip: { $in: tripIds } }).populate('trip passenger');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  bookTrip,
  getMyBookings,
  getDriverBookings,
}; 