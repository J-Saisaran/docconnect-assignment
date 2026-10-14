const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

const LOGGED_IN_USER_ID = '65f000000000000000000001';

// POST /connect - Send a connection request from current user to target user
const createConnectRequest = async (req, res) => {
  try {
    const { recipientId, senderId: reqSenderId } = req.body;
    const senderId = reqSenderId || req.headers['x-user-id'] || LOGGED_IN_USER_ID;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'recipientId is required in request body',
      });
    }

    if (senderId === recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself',
      });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found',
      });
    }

    // Upsert the connection request with status 'requested'
    const connection = await ConnectionRequest.findOneAndUpdate(
      { sender: senderId, recipient: recipientId },
      { status: 'requested' },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Connection request sent successfully',
      recipientId,
      status: 'requested',
      connection,
    });
  } catch (error) {
    console.error('Error creating connection request:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send connection request',
      error: error.message,
    });
  }
};

// GET /connect/requested - Get list of users requested by current user
const getRequestedUserIds = async (req, res) => {
  try {
    const senderId = req.query.senderId || req.headers['x-user-id'] || LOGGED_IN_USER_ID;

    const requests = await ConnectionRequest.find({
      sender: senderId,
      status: 'requested',
    });

    const requestedIds = requests.map((r) => r.recipient.toString());

    return res.status(200).json({
      success: true,
      requestedIds,
    });
  } catch (error) {
    console.error('Error fetching requested users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch requested user IDs',
      error: error.message,
    });
  }
};

module.exports = {
  createConnectRequest,
  getRequestedUserIds,
};
