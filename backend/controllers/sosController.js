const SosAlert = require('../models/SosAlert');

exports.triggerSos = async (req, res) => {
  try {
    const { userId, name, contact, location } = req.body;
    
    const alert = new SosAlert({
      user: userId,
      name,
      contact,
      location
    });

    await alert.save();
    res.status(201).json({ message: "SOS Alert received. Sending support.", alert });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await SosAlert.find({ status: 'Active' }).sort({ createdAt: -1 }).populate('user');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
