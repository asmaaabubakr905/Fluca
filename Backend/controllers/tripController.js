const Trip = require('../models/Trip');
const Offer = require('../models/Offer');

// Create a new trip (Driver only, now also allow Passenger for private trips)
async function createTrip(req, res) {
  try {
    const {
      from,
      to,
      date,
      time,
      price,
      seats,
      boatType,
      boatId,
      description,
      type,
      location,
      startLat,
      startLng,
      image,
    } = req.body;
    console.log("Backend received trip data:", {
      from,
      to,
      date,
      time,
      price,
      seats,
      description,
      type,
    });
    console.log(
      "Backend received image:",
      image ? "Image present (length: " + image.length + ")" : "No image"
    );
    // إذا كانت الرحلة خاصة، اسمح للراكب بإنشائها
    if (type === "private" && req.user.role === "Passenger") {
      const tripData = {
        from,
        to,
        date,
        time,
        price: price || 0,
        seats,
        type: "private",
        passengers: [req.user.id],
        status: "Not Started",
        description,
        accepted: false,
      };
      if (location && location.lat && location.lng) {
        tripData.location = location;
      } else if (startLat && startLng) {
        tripData.location = { lat: startLat, lng: startLng };
      }
      if (image) {
        tripData.image = image;
        console.log("Private trip - Image saved to tripData");
      }
      const trip = new Trip(tripData);
      await trip.save();
      console.log("Private trip saved with image:", trip.image ? "Yes" : "No");
      return res.status(201).json(trip);
    }
    // الرحلات العامة فقط للكابتن
    if (req.user.role !== "Driver") {
      return res.status(403).json({ message: "Only drivers can create trips" });
    }
    const tripData = {
      from,
      to,
      date,
      time,
      price,
      seats,
      captain: req.user.id,
      boatType,
      boatId,
      description,
      type: type || "public",
      accepted: true,
    };
    if (location && location.lat && location.lng) {
      tripData.location = location;
    } else if (startLat && startLng) {
      tripData.location = { lat: startLat, lng: startLng };
    }
    if (image) {
      tripData.image = image;
      console.log("Public trip - Image saved to tripData");
    }
    const trip = new Trip(tripData);
    await trip.save();
    console.log("Public trip saved with image:", trip.image ? "Yes" : "No");
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get all trips (public, with optional filters)
async function getAllTrips(req, res) {
  try {
    const { from, to, date } = req.query;
    const filter = {};
    if (from) filter.from = from;
    if (to) filter.to = to;
    if (date) filter.date = date;
    const trips = await Trip.find(filter)
      .populate("captain", "name boatType boatId boatImage")
      .populate("passengers", "name email phone");
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get a single trip by ID
async function getTripById(req, res) {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("captain", "name boatType boatId boatImage phone")
      .populate("passengers", "name email phone");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Update a trip (Driver only, owner)
async function updateTrip(req, res) {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.captain.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updates = req.body;
    Object.assign(trip, updates);
    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Delete a trip (Driver only, owner)
async function deleteTrip(req, res) {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.captain.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Trip.deleteOne({ _id: req.params.id });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Change trip status (Driver only, owner)
async function changeTripStatus(req, res) {
  try {
    const { status } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.captain.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (!["Not Started", "Started", "Completed", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    trip.status = status;
    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  changeTripStatus,
}; 