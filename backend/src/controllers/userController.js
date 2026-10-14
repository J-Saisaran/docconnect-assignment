const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');

const LOGGED_IN_USER_ID = '65f000000000000000000001';

// GET /users - Get all users with requested status relative to current user
const getUsers = async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId || req.headers['x-user-id'] || LOGGED_IN_USER_ID;

    // Fetch the current user details
    const currentUser = await User.findById(currentUserId);

    // Find all connection requests sent by the current user
    const sentRequests = await ConnectionRequest.find({
      sender: currentUserId,
      status: 'requested',
    });

    const requestedRecipientIds = new Set(
      sentRequests.map((req) => req.recipient.toString())
    );

    // Find all other users (for discover list)
    const otherUsers = await User.find({ _id: { $ne: currentUserId } }).lean();

    const usersWithStatus = otherUsers.map((user) => ({
      ...user,
      isRequested: requestedRecipientIds.has(user._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      currentUser,
      users: usersWithStatus,
      requestedUserIds: Array.from(requestedRecipientIds),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// GET /users/me - Get current logged-in user profile
const getCurrentUser = async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId || req.headers['x-user-id'] || LOGGED_IN_USER_ID;
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch current user',
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  LOGGED_IN_USER_ID,
};
