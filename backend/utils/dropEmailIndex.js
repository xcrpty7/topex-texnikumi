require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const run = async () => {
  await connectDB();
  try {
    await mongoose.connection.collection('users').dropIndex('email_1');
    console.log('✅ email_1 index dropped');
  } catch (e) {
    if (e.code === 27) console.log('ℹ️  email_1 index does not exist');
    else console.error('❌', e.message);
  }
  process.exit(0);
};
run();
