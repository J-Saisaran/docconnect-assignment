require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/docconnect';

  // 1. Attempt connection to primary MongoDB URI (e.g. local MongoDB instance)
  try {
    console.log(`Connecting to MongoDB URI: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(' MongoDB connected successfully to local instance');
    return;
  } catch (err) {
    console.error(`Failed to connect to ${uri}:`, err.message);
  }

  // 2. Fallback to in-memory MongoDB if local instance is unavailable
  try {
    console.log('Local MongoDB not available. Starting in-memory MongoDB instance for seamless zero-config evaluation...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(` In-Memory MongoDB started and connected successfully at: ${memoryUri}`);
  } catch (err) {
    console.error('Fatal: Could not connect to any MongoDB instance:', err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };

// If executed directly from CLI (e.g. node src/config/db.js), run connectDB
if (require.main === module) {
  connectDB();
}
