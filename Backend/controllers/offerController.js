const Offer = require('../models/Offer');
const Trip = require('../models/Trip');

// Create a new offer (Driver only)
async function createOffer(req, res) {
  try {
    if (req.user.role !== 'Driver') return res.status(403).json({ message: 'Only drivers can send offers' });
    const { tripId, price } = req.body;
    const offer = new Offer({ trip: tripId, captain: req.user.id, price });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Get all offers for a trip
async function getOffersForTrip(req, res) {
  try {
    const offers = await Offer.find({ trip: req.params.tripId }).populate('captain', 'name boatType boatId');
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Accept an offer
async function acceptOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    // لو العرض في حالة counter، الكابتن هو اللي يوافق
    if (offer.status === 'counter') {
      if (req.user.role !== 'Driver' || offer.captain.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only the captain can accept the counter offer' });
      }
      offer.status = 'accepted';
      offer.price = offer.counterPrice; // السعر الجديد
      await offer.save();
      // حدث الرحلة
      const trip = await Trip.findById(offer.trip);
      trip.captain = offer.captain;
      trip.accepted = true;
      trip.price = offer.counterPrice;
      await trip.save();
      return res.json(offer);
    }
    // الحالة العادية: الراكب هو اللي يوافق
    if (req.user.role !== 'Passenger') return res.status(403).json({ message: 'Only passengers can accept offers' });
    offer.status = 'accepted';
    await offer.save();
    // حدث الرحلة: عين الكابتن، accepted=true، السعر
    const trip = await Trip.findById(offer.trip);
    trip.captain = offer.captain;
    trip.accepted = true;
    trip.price = offer.price;
    await trip.save();
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Reject an offer
async function rejectOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    // لو العرض في حالة counter، الكابتن هو اللي يرفض
    if (offer.status === 'counter') {
      if (req.user.role !== 'Driver' || offer.captain.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only the captain can reject the counter offer' });
      }
      offer.status = 'rejected';
      await offer.save();
      return res.json(offer);
    }
    // الحالة العادية: الراكب هو اللي يرفض
    if (req.user.role !== 'Passenger') return res.status(403).json({ message: 'Only passengers can reject offers' });
    offer.status = 'rejected';
    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Counter offer (Passenger)
async function counterOffer(req, res) {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (req.user.role !== 'Passenger') return res.status(403).json({ message: 'Only passengers can counter offers' });
    offer.status = 'counter';
    offer.counterPrice = req.body.counterPrice;
    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  createOffer,
  getOffersForTrip,
  acceptOffer,
  rejectOffer,
  counterOffer,
}; 