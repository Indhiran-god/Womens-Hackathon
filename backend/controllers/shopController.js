const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, subtotal, deliveryCharge, gst, grandTotal, paymentMethod } = req.body;
    
    const newOrder = new Order({
      user: userId,
      items,
      subtotal,
      deliveryCharge,
      gst,
      grandTotal,
      paymentMethod
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
