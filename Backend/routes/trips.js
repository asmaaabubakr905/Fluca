const express = require("express");
const multer = require("multer");
const path = require("path");
const Trip = require("../models/Trip");
const auth = require("../middlewares/auth");
const Offer = require("../models/Offer");
const tripController = require('../controllers/tripController');

const router = express.Router();

// Multer setup for trip image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Create a new trip (Driver only, now also allow Passenger for private trips)
router.post("/", auth, tripController.createTrip);

// Get all trips (public, with optional filters)
router.get("/", tripController.getAllTrips);

// Get a single trip by ID
router.get("/:id", tripController.getTripById);

// Update a trip (Driver only, owner)
router.put("/:id", auth, tripController.updateTrip);

// Delete a trip (Driver only, owner)
router.delete("/:id", auth, tripController.deleteTrip);

// Change trip status (Driver only, owner)
router.patch("/:id/status", auth, tripController.changeTripStatus);

// Accept private trip (Driver only)
router.patch("/:id/accept", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.type !== "private")
      return res.status(400).json({ message: "Not a private trip" });
    if (req.user.role !== "Driver")
      return res.status(403).json({ message: "Only drivers can accept trips" });
    if (trip.accepted || trip.captain) {
      return res
        .status(400)
        .json({ message: "Trip already accepted by another captain" });
    }
    trip.captain = req.user.id;
    trip.accepted = true;
    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ====== عروض الكباتن على الرحلات الخاصة ======
// الكابتن يرسل عرض سعر لرحلة خاصة
router.post("/offers", auth, async (req, res) => {
  try {
    if (req.user.role !== "Driver")
      return res.status(403).json({ message: "Only drivers can send offers" });
    const { tripId, price } = req.body;
    const offer = new Offer({ trip: tripId, captain: req.user.id, price });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// جلب كل العروض الخاصة برحلة معينة (يراها الراكب)
router.get("/offers/trip/:tripId", auth, async (req, res) => {
  try {
    const offers = await Offer.find({ trip: req.params.tripId }).populate(
      "captain",
      "name boatType boatId"
    );
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// الراكب يوافق على عرض
router.patch("/offers/:id/accept", auth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if (req.user.role !== "Passenger")
      return res
        .status(403)
        .json({ message: "Only passengers can accept offers" });
    offer.status = "accepted";
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
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// الراكب يرفض عرض
router.patch("/offers/:id/reject", auth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if (req.user.role !== "Passenger")
      return res
        .status(403)
        .json({ message: "Only passengers can reject offers" });
    offer.status = "rejected";
    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// الراكب يقترح سعر جديد (counter offer)
router.patch("/offers/:id/counter", auth, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if (req.user.role !== "Passenger")
      return res
        .status(403)
        .json({ message: "Only passengers can counter offers" });
    offer.status = "counter";
    offer.counterPrice = req.body.counterPrice;
    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// تحديث موقع الكابتن
router.patch("/:id/location", auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    console.log(
      "Received location update:",
      lat,
      lng,
      "for trip",
      req.params.id,
      "by user",
      req.user.id
    );
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    // فقط الكابتن يمكنه تحديث موقعه
    if (trip.captain.toString() !== req.user.id) {
      console.log(
        "Not authorized: trip.captain",
        trip.captain,
        "req.user.id",
        req.user.id
      );
      return res.status(403).json({ message: "Not authorized" });
    }
    trip.location = { lat, lng };
    await trip.save();
    res.json({ message: "Location updated", location: trip.location });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// جلب موقع الرحلة
router.get("/:id/location", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ location: trip.location });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
