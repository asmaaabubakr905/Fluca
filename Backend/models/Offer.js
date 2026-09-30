const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'counter'], default: 'pending' },
  counterPrice: { type: Number }, // إذا اقترح الراكب سعر جديد
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema); 