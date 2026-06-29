const mongoose = require('mongoose');

const MAX_RETRIES = 3;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.error(`❌ MongoDB ulanish xatosi (${retryCount + 1}/${MAX_RETRIES}): ${error.message}`);
      await new Promise(r => setTimeout(r, 3000));
      return connectDB(retryCount + 1);
    }
    console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
