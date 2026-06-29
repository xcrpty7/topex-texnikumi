const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI aniqlanmagan — MongoDB ulanmadi');
    return mongoose;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
    console.warn('⚠️  MongoDB ulanmadi — server DB siz ishga tushdi');
  }
  return mongoose;
};

module.exports = connectDB;
