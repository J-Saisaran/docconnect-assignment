const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const ConnectionRequest = require('./models/ConnectionRequest');
const { connectDB, disconnectDB } = require('./config/db');

dotenv.config();

const FIXED_USERS = [
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000001'),
    name: 'Dr. Arjun Mehta',
    occupation: 'Cardiology',
    profileImage: '/assets/Profile image/Image-3.png',
    location: 'Chennai, Tamil Nadu',
    connectsCount: 2,
    isOfficial: false,
  },
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000002'),
    name: 'Dr. Priya Sharma',
    occupation: 'Healthcare Technology',
    profileImage: '/assets/Profile image/Image-1.png',
    location: 'Bengaluru, Karnataka',
    connectsCount: 2,
    isOfficial: false,
  },
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000003'),
    name: 'Dr. Rajesh Kumar',
    occupation: 'Neurology',
    profileImage: '/assets/Profile image/Image-2.png',
    location: 'Mumbai, Maharashtra',
    connectsCount: 2,
    isOfficial: false,
  },
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000004'),
    name: 'Dr. Sneha Patel',
    occupation: 'Pediatrics',
    profileImage: '/assets/Profile image/Image-4.png',
    location: 'Delhi NCR',
    connectsCount: 2,
    isOfficial: false,
  },
  {
    _id: new mongoose.Types.ObjectId('65f000000000000000000005'),
    name: 'Dr. Vikram Singh',
    occupation: 'Orthopedics',
    profileImage: '/assets/Profile image/Image.png',
    location: 'Hyderabad, Telangana',
    connectsCount: 2,
    isOfficial: false,
  },
];

const FIXED_POSTS = [
  {
    _id: new mongoose.Types.ObjectId('65f100000000000000000001'),
    author: new mongoose.Types.ObjectId('65f000000000000000000002'), // Dr. Priya Sharma / Docconnect
    content: "Welcome to Docconnect! We're building India's largest healthcare professional network. Connect with doctors, nurses, pharmacists, and medical students across the country. Let's transform healthcare collaboration together. 🇮🇳",
    image: '/assets/Post image/create-post-image-5@2x.png',
    carouselImages: ['/assets/Post image/create-post-image-5@2x.png'],
    likesCount: 5,
    sharesCount: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    _id: new mongoose.Types.ObjectId('65f100000000000000000002'),
    author: new mongoose.Types.ObjectId('65f000000000000000000001'), // Dr. Arjun Mehta
    content: "We make sure that your loved ones get all the support they need and feel at home. Dedicated geriatric clinical care and compassionate rehabilitation for senior citizens. 👵❤️",
    image: '/assets/Post image/create-post-image-1@2x.png',
    carouselImages: ['/assets/Post image/create-post-image-1@2x.png'],
    likesCount: 5,
    sharesCount: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    _id: new mongoose.Types.ObjectId('65f100000000000000000003'),
    author: new mongoose.Types.ObjectId('65f000000000000000000004'), // Dr. Sneha Patel
    content: "Healthcare Professional Wellness Week: Tuesday is dedicated to mental health and clinical mindfulness. Recharging is essential to avoid burnout and provide high-quality care. 🧘‍♂️✨",
    image: '/assets/Post image/create-post-image-2@2x.png',
    carouselImages: ['/assets/Post image/create-post-image-2@2x.png'],
    likesCount: 9,
    sharesCount: 4,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    _id: new mongoose.Types.ObjectId('65f100000000000000000004'),
    author: new mongoose.Types.ObjectId('65f000000000000000000003'), // Dr. Rajesh Kumar
    content: "Not all heroes wear capes. Some wear scrubs... Saluting our tireless emergency residents, OT technicians, and intensive care nurses working around the clock. 🩺🏥",
    image: '/assets/Post image/create-post-image-3@2x.png',
    carouselImages: ['/assets/Post image/create-post-image-3@2x.png'],
    likesCount: 14,
    sharesCount: 7,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
  {
    _id: new mongoose.Types.ObjectId('65f100000000000000000005'),
    author: new mongoose.Types.ObjectId('65f000000000000000000005'), // Dr. Vikram Singh
    content: "World Alzheimer's & Dementia Awareness: Between what was and what is, there is presence. Early clinical intervention and compassionate communication make a profound difference. 🧠💜",
    image: '/assets/Post image/create-post-image-4@2x.png',
    carouselImages: ['/assets/Post image/create-post-image-4@2x.png'],
    likesCount: 11,
    sharesCount: 5,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
  },
];

const seedData = async (exitOnComplete = true) => {
  try {
    console.log('Seeding database with 5 users and 5 posts...');
    
    // Clear collections
    await User.deleteMany({});
    await Post.deleteMany({});
    await ConnectionRequest.deleteMany({});

    // Insert users
    const createdUsers = await User.insertMany(FIXED_USERS);
    console.log(` Created ${createdUsers.length} users successfully`);

    // Insert posts
    const createdPosts = await Post.insertMany(FIXED_POSTS);
    console.log(` Created ${createdPosts.length} posts successfully`);

    console.log('Database seeded successfully!');
    console.log('Logged-in User ID (Dr. Arjun Mehta): 65f000000000000000000001');

    if (exitOnComplete) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (err) {
    console.error('Error seeding database:', err);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

// If run directly: node seed.js
if (require.main === module) {
  connectDB().then(() => seedData(true));
}

module.exports = { seedData, FIXED_USERS, FIXED_POSTS };
