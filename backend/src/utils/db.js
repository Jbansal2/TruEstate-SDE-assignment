// root/backend/src/utils/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not defined in env');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
