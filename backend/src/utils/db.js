const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message || err);
    throw err;
  }

  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
};

module.exports = connectDB;
