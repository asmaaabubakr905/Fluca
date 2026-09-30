const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Passenger', 'Driver'], required: true },
  phone: { type: String }, // رقم الهاتف للكابتن
  status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Approved' },
  // Driver-specific fields
  boatType: { type: String },
  boatId: { type: String },
  seats: { type: Number },
  boatImage: { type: String }, // Path to uploaded image
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 