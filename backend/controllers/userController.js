const User = require('../models/User');

// @desc    Get all users (mostly for assigning tasks)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    // Both Admin and Members might need to see users for various UI components, 
    // but we can restrict what they see. Returning id, name, email, role.
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
};
