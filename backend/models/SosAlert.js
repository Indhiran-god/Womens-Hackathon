const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  contact: { type: String },
  location: {
    lat: Number,
    lng: Number,
    addr: String
  },
  status: { type: String, default: 'Active', enum: ['Active', 'Resolved'] },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SosAlert', sosAlertSchema);
