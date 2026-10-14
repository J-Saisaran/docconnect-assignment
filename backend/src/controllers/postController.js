const Post = require('../models/Post');

// GET /posts - Get all posts with populated author info
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name occupation profileImage location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message,
    });
  }
};

module.exports = {
  getPosts,
};
