const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    qty: Number,
    price: Number
  }],
  subtotal: Number,
  deliveryCharge: Number,
  gst: Number,
  grandTotal: Number,
  status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'] },
  paymentMethod: { type: String, default: 'COD' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
