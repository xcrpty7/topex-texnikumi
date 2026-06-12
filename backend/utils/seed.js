require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Article = require('../models/Article');
const Teacher = require('../models/Teacher');

const seed = async () => {
  console.log('🌱 Seed boshlandi...');

  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@topex.uz',
      password: process.env.ADMIN_PASSWORD || 'Admin@topex2024',
      role: 'SUPER_ADMIN',
    });
    console.log(`✅ Super Admin yaratildi: ${admin.email}`);
  } else {
    console.log(`ℹ️  Super Admin allaqachon mavjud: ${existingAdmin.email}`);
  }

  const coursesCount = await Course.countDocuments();
  if (coursesCount === 0) {
    const admin = await User.findOne({ role: 'SUPER_ADMIN' });
    const courses = [
      { title: 'Dasturlash Asoslari', shortDescription: 'Dasturlash dunyosiga birinchi qadamingiz', category: 'Dasturlash', level: 'Boshlang\'ich', duration: '6 oy', price: 0, isActive: true, isFeatured: true, createdBy: admin._id, requirements: ['Kompyuter va internet', 'O\'rganishga hohish'], outcomes: ['Python dasturlash', 'Web sayt yaratish', 'Portfolio loyiha'] },
      { title: 'Marketing va Raqamli Savdo', shortDescription: 'Zamonaviy marketing texnikalarini egallang', category: 'Marketing', level: 'Boshlang\'ich', duration: '4 oy', price: 0, isActive: true, isFeatured: true, createdBy: admin._id },
      { title: 'Kompyuter Grafikasi va Dizayn', shortDescription: 'Kreativ dizayn bo\'yicha mutaxassis bo\'ling', category: 'Grafik Dizayn', level: 'Boshlang\'ich', duration: '5 oy', price: 0, isActive: true, isFeatured: false, createdBy: admin._id },
      { title: 'Bank va Moliya Nazoratchisi', shortDescription: 'Moliya sohasida karyerangizni boshlang', category: 'Bank', level: 'O\'rta', duration: '8 oy', price: 0, isActive: true, isFeatured: false, createdBy: admin._id },
      { title: 'Raqamli Ma\'lumotlar Tahlili', shortDescription: 'Data Science sohasiga kirish', category: 'Ma\'lumotlar Tahlili', level: 'O\'rta', duration: '6 oy', price: 0, isActive: true, isFeatured: true, createdBy: admin._id },
    ];
    for (const c of courses) await Course.create(c);
    console.log(`✅ ${courses.length} ta kurs yaratildi`);
  } else {
    console.log(`ℹ️  Kurslar allaqachon mavjud: ${coursesCount} ta`);
  }

  const articlesCount = await Article.countDocuments();
  if (articlesCount === 0) {
    const admin = await User.findOne({ role: 'SUPER_ADMIN' });
    const articles = [
      { title: 'TOPEX Texnikumida O\'qish Qanday Afzalliklari Bor?', excerpt: 'TOPEX Texnikumida o\'qishning asosiy afzalliklari haqida.', category: 'Yangiliklar', author: admin._id, isPublished: true, publishedAt: new Date(), tags: ['ta\'lim', 'texnikum', 'karyera'] },
      { title: 'Grant va Stipendiyalar: Kimlar Olishi Mumkin?', excerpt: '2 million so\'mgacha grant olish imkoniyatlari haqida.', category: 'Granlar', author: admin._id, isPublished: true, publishedAt: new Date(Date.now() - 86400000), tags: ['grant', 'stipendiya', 'SAT', 'IELTS'] },
      { title: 'Bitiruvchilarimiz Qanday Natijalar Qo\'lga Kiritdi?', excerpt: 'Muvaffaqiyatli bitiruvchilarimizning ish va karyera tajribalari.', category: 'Muvaffaqiyatlar', author: admin._id, isPublished: true, publishedAt: new Date(Date.now() - 172800000), tags: ['bitiruvchilar', 'muvaffaqiyat', 'karyera'] },
    ];
    for (const a of articles) await Article.create(a);
    console.log(`✅ ${articles.length} ta maqola yaratildi`);
  } else {
    console.log(`ℹ️  Maqolalar allaqachon mavjud: ${articlesCount} ta`);
  }

  const teachersCount = await Teacher.countDocuments();
  if (teachersCount === 0) {
    const teachers = [
      { name: "G'AYRAT SHOUMAROV",               image: '/assets/Ustozlar/DSC01143.webp',      order: 1, active: true },
      { name: 'OLGERD FILLIPOV',                 image: '/assets/Ustozlar/DSC01155.webp',      order: 2, active: true },
      { name: 'RUSTAM KARIMOV',                  image: '/assets/Ustozlar/DSC01164.webp',      order: 3, active: true },
      { name: 'DILSHOD AZIZOV',                  image: '/assets/Ustozlar/DSC01187.webp',      order: 4, active: true },
      { name: 'AKMAL RAHIMOV',                   image: '/assets/Ustozlar/DSC01199.webp',      order: 5, active: true },
      { name: "NORBOYEV NE'MATBEK CHORIYEVICH",  image: '/assets/Ustozlar/teacher-new-1.webp', order: 6, active: true },
      { name: "KUBAYEV RO'ZIMUROD HIKMATILLAYEVICH", image: '/assets/Ustozlar/teacher-new-2.webp', order: 7, active: true },
      { name: 'BURTSEVA ALEKSANDRA VASILEVNA',   image: '/assets/Ustozlar/teacher-new-3.webp', order: 8, active: true },
      { name: 'ABDULLAYEV OYBEK ODILOVICH',      image: '/assets/Ustozlar/teacher-new-4.webp', order: 9, active: true },
      { name: 'ERKINOV JAVOHIRBEK JURABEKOVICH', image: '/assets/Ustozlar/teacher-new-5.webp', order: 10, active: true },
    ];
    for (const d of teachers) await Teacher.create(d);
    console.log(`✅ ${teachers.length} ta o'qituvchi yaratildi`);
  } else {
    console.log(`ℹ️  O'qituvchilar allaqachon mavjud: ${teachersCount} ta`);
  }

  console.log('✅ Seed muvaffaqiyatli yakunlandi!');
};

module.exports = seed;

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seed();
      console.log('─'.repeat(50));
      console.log('Admin kirish ma\'lumotlari:');
      console.log(`  Email:  ${process.env.ADMIN_EMAIL}`);
      console.log(`  Parol:  ${process.env.ADMIN_PASSWORD}`);
      console.log('─'.repeat(50));
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seed xatosi:', err.message);
      process.exit(1);
    }
  })();
}
