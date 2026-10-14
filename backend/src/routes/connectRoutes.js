const express = require('express');
const router = express.Router();
const {
  createConnectRequest,
  getRequestedUserIds,
} = require('../controllers/connectController');

// POST /connect
router.post('/', createConnectRequest);

// GET /connect/requested
router.get('/requested', getRequestedUserIds);

module.exports = router;
