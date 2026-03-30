const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { name, contact, age, lmpDate, language, profilePic } = req.body;
    if (!name || !contact) return res.status(400).json({ error: "Name and contact required" });

    let user = await User.findOne({ contact });
    
    if (user) {
      // Update existing user
      if (name) user.name = name;
      if (age) user.age = age;
      if (lmpDate) user.lmpDate = lmpDate;
      if (language) user.language = language;
      if (profilePic) user.profilePic = profilePic;
      await user.save();
      return res.status(200).json({ message: "Profile updated", user });
    }

    // Register new
    user = new User({ name, contact, age, lmpDate, language, profilePic });
    await user.save();
    return res.status(201).json({ message: "Registered successfully", user });

  } catch (error) {
    console.error('[registerUser Error]', error.message);
    // If MongoDB is not connected, return a graceful response so app doesn't crash
    if (error.name === 'MongoNotConnectedError' || error.message.includes('ECONNREFUSED') || error.message.includes('buffering timed out')) {
      return res.status(200).json({ 
        message: "Offline mode - saved locally", 
        user: { name: req.body.name, contact: req.body.contact, _id: null } 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getUserByContact = async (req, res) => {
  try {
    const { contact } = req.params;
    if (!contact) return res.status(400).json({ error: "Contact required" });

    const user = await User.findOne({ contact });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);

  } catch (error) {
    console.error('[getUserByContact Error]', error.message);
    // Graceful offline fallback — return 404 so frontend uses localStorage
    if (error.name === 'MongoNotConnectedError' || error.message.includes('ECONNREFUSED') || error.message.includes('buffering timed out')) {
      return res.status(404).json({ error: "DB offline - user not in database" });
    }
    res.status(500).json({ error: error.message });
  }
};
