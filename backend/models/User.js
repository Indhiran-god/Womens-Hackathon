const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  age: { type: Number },
  lmpDate: { type: Date },
  language: { type: String, default: 'en' },
  profilePic: { type: String, default: '' },
  week: { type: Number, default: 24 },
  risk: { type: String, default: 'Low', enum: ['Low', 'Medium', 'High'] },
  bloodGroup: { type: String },
  address: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
