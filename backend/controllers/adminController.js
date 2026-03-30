const User = require('../models/User');
const Order = require('../models/Order');
const SosAlert = require('../models/SosAlert');

// Admin Dashboard Summary
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeAlerts = await SosAlert.countDocuments({ status: 'Active' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

    res.json({
      totalUsers,
      activeAlerts,
      pendingOrders,
      newUsersToday
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name contact').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await SosAlert.findByIdAndUpdate(alertId, { status: 'Resolved', resolvedAt: new Date() }, { new: true });
    res.json({ message: "SOS Alert Resolved", alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
