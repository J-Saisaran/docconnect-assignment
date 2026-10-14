const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const User = require('./models/User');
const { seedData } = require('./seed');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const connectRoutes = require('./routes/connectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static assets (images, icons)
app.use(express.static(path.join(__dirname, '../public')));

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'DocConnect Backend API',
    endpoints: {
      posts: '/posts',
      users: '/users',
      connect: '/connect',
      currentUser: '/users/me',
      health: '/health',
    },
    hardcodedLoggedInUserId: '65f000000000000000000001',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Primary Routes as specified in assignment
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/connect', connectRoutes);

// Also mount under /api prefix for standard compatibility
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connect', connectRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// Start Server and auto-seed if empty
const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Database is empty. Auto-seeding initial users and posts...');
    await seedData(false);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n=================================================`);
    console.log(` DocConnect API Server running on port ${PORT}`);
    console.log(` Base URL: http://localhost:${PORT}`);
    console.log(` Endpoints:`);
    console.log(`   - GET  /posts`);
    console.log(`   - GET  /users`);
    console.log(`   - GET  /users/me`);
    console.log(`   - POST /connect`);
    console.log(` Logged-in User ID: 65f000000000000000000001 (Dr. Arjun Mehta)`);
    console.log(`=================================================\n`);
  });
};

startServer();

module.exports = app;
