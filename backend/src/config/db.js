const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`Connecting to MongoDB URI: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(' MongoDB connected successfully');
      return;
    } catch (err) {
      console.error('Failed to connect to provided MONGODB_URI:', err.message);
    }
  }

  // Attempt local MongoDB instance
  try {
    const localUri = 'mongodb://127.0.0.1:27017/docconnect';
    console.log(`Attempting connection to local MongoDB at ${localUri}...`);
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(' Local MongoDB connected successfully');
    return;
  } catch (err) {
    console.log('Local MongoDB not available. Starting in-memory MongoDB instance for seamless zero-config evaluation...');
  }

  // Fallback to in-memory MongoDB
  try {
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
