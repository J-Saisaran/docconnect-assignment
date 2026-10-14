const express = require('express');
const router = express.Router();
const { getPosts } = require('../controllers/postController');

// GET /posts
router.get('/', getPosts);

module.exports = router;
