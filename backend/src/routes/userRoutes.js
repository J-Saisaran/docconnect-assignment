const express = require('express');
const router = express.Router();
const { getUsers, getCurrentUser } = require('../controllers/userController');

// GET /users/me
router.get('/me', getCurrentUser);

// GET /users
router.get('/', getUsers);

module.exports = router;
