const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://root:rootpassword@localhost:27017/appdb?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('[DB SUCCESS] Connected to MongoDB');
  } catch (error) {
    console.error(`[DB ERROR] Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
