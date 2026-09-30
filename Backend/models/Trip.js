const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  boatType: { type: String },
  boatId: { type: String },
  status: { type: String, enum: ['Not Started', 'Started', 'Completed', 'Closed'], default: 'Not Started' },
  closed: { type: Boolean, default: false },
  image: { type: String }, // Path to uploaded image
  description: { type: String },
  rating: { type: Number, default: 0 },
  type: { type: String, enum: ['public', 'private'], default: 'public' },
  accepted: { type: Boolean, default: false },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema); 