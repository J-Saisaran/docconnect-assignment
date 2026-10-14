const express = require('express');
const router = express.Router();
const {
  createConnectRequest,
  getRequestedUserIds,
  resetConnections,
  deleteConnectRequest,
} = require('../controllers/connectController');

// POST /connect
router.post('/', createConnectRequest);

// POST or GET /connect/reset
router.post('/reset', resetConnections);
router.get('/reset', resetConnections);

// DELETE /connect/:recipientId
router.delete('/:recipientId', deleteConnectRequest);

// GET /connect/requested
router.get('/requested', getRequestedUserIds);

module.exports = router;

