const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
      console.log('⚠️  In-memory MongoDB ga o\'tilmoqda...');
    }
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create({
    instance: { dbName: 'topex' },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`✅ In-memory MongoDB ulandi: ${uri}`);
};

module.exports = connectDB;
