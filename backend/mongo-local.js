// Lokal sinov uchun in-memory MongoDB (Windows'da haqiqiy mongod o'rnatmasdan).
// 127.0.0.1:27017 ga bog'lanadi — backend/.env dagi MONGO_URI ni o'zgartirmasdan ishlaydi.
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { ip: '127.0.0.1', port: 27017, dbName: 'topex' },
  });
  console.log('✅ In-memory MongoDB READY at', mongod.getUri());
  console.log('   (to\'xtatish uchun bu jarayonni yoping)');

  const shutdown = async () => { await mongod.stop(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.stdin.resume(); // jarayonni tirik saqlash
})();
