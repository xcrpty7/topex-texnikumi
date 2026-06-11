require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const SiteSettings = require('../models/SiteSettings');

// Yagona manzil — saytda hamma joyda ko'rsatiladi
const NEW_ADDRESS = 'Сергели-3, ул. Янги Сергели Йули, д. 49';

// Eskirgan standart matnlarni yangilash — FAQAT qiymat hali eski default bo'lsa
// (admin o'zgartirgan bo'lsa, tegmaymiz)
const STALE_DEFAULTS = [
  { field: 'blogHeroTitle',    old: 'Bizning Videolar',                                                            new: 'Yangiliklar' },
  { field: 'blogHeroBadge',    old: 'Video Galereya',                                                              new: 'Yangiliklar' },
  { field: 'blogHeroSubtitle', old: "Topex Texnikumidagi amaliy darslar, tadbirlar va hayot lavhalaridan eng sara videolar.", new: "Texnikumimiz hayotidan eng so'nggi yangiliklar, yutuqlar va tadbirlar." },
  { field: 'coursesHeroTitle', old: "Barcha kurslar va yo'nalishlar",                                               new: "Yo'nalishlar" },
];

const run = async () => {
  await connectDB();
  const res = await SiteSettings.updateMany({}, { $set: { address: NEW_ADDRESS, address2: '' } });
  console.log(`✅ Manzil yangilandi (${res.modifiedCount} ta hujjat) → ${NEW_ADDRESS}`);

  // Eskirgan default matnlarni yangilash (faqat o'zgartirilmaganlarini)
  for (const { field, old, new: val } of STALE_DEFAULTS) {
    const r = await SiteSettings.updateMany({ [field]: old }, { $set: { [field]: val } });
    if (r.modifiedCount > 0) console.log(`✅ ${field}: "${old}" → "${val}"`);
  }

  // Agar hali settings hujjati bo'lmasa — yangisini standart qiymatlar bilan yaratamiz
  const count = await SiteSettings.countDocuments();
  if (count === 0) {
    await SiteSettings.create({ address: NEW_ADDRESS, address2: '' });
    console.log('✅ Yangi settings hujjati yaratildi');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Xatolik:', err.message);
  process.exit(1);
});
