require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Article = require('../models/Article');
const Teacher = require('../models/Teacher');

const seed = async () => {
  console.log('🌱 Seed boshlandi...');

  // Eski email_1 unique index-ni tashlab yuboramiz (email maydoni olib tashlandi)
  try {
    await mongoose.connection.collection('users').dropIndex('email_1');
    console.log('✅ email_1 index o\'chirildi');
  } catch (e) {
    if (e.code !== 27) console.warn('⚠️  email_1 index o\'chirishda xato:', e.message);
  }

  const ADMIN_PHONE = (process.env.ADMIN_PHONE || '+998 99 999 99 99').replace(/[\s\-()]/g, '').trim();
  const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
  const existingAdmin = await User.findOne({ $or: [{ login: ADMIN_LOGIN }, { phone: ADMIN_PHONE }] });
  if (!existingAdmin) {
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Super Admin',
      phone: ADMIN_PHONE,
      login: ADMIN_LOGIN,
      password: process.env.ADMIN_PASSWORD || 'Admin@topex2024',
      role: 'SUPER_ADMIN',
    });
    console.log(`✅ Super Admin yaratildi: login=${admin.login} / tel=${admin.phone}`);
  } else {
    // Telefon, login va PAROLNI .env bilan sinxronlaymiz (.env — yagona manba).
    let changed = false;
    if (existingAdmin.phone !== ADMIN_PHONE) { existingAdmin.phone = ADMIN_PHONE; changed = true; }
    if (!existingAdmin.login) { existingAdmin.login = ADMIN_LOGIN; changed = true; }
    if (process.env.ADMIN_PASSWORD) {
      // password o'zgartirilsa pre('save') hook uni qayta hash qiladi
      existingAdmin.password = process.env.ADMIN_PASSWORD;
      changed = true;
    }
    if (changed) await existingAdmin.save({ validateBeforeSave: false });
    console.log(`ℹ️  Super Admin yangilandi: login=${existingAdmin.login} / parol .env dan o'rnatildi`);
  }

  // Demo kurslar o'chirildi — kurslar faqat admin panel orqali qo'shiladi.
  // "Yo'nalishlar" sahifasidagi pastki kurs-kartochkalar bo'sh bo'lsa ko'rinmaydi.
  const coursesCount = await Course.countDocuments();
  console.log(`ℹ️  Mavjud kurslar: ${coursesCount} ta (demo seed o'chirilgan)`);

  const articlesCount = await Article.countDocuments();
  if (articlesCount === 0) {
    const admin = await User.findOne({ role: 'SUPER_ADMIN' });
    const articles = [
      { title: 'TOPEX Texnikumida O\'qish Qanday Afzalliklari Bor?', content: '<p>TOPEX Texnikumida o\'qishning asosiy afzalliklari: zamonaviy ta\'lim dasturlari, tajribali o\'qituvchilar, amaliyot imkoniyatlari va karyera rivojlanishi. Biz sizni kelajak kasbiga tayyorlaymiz.</p>', excerpt: 'TOPEX Texnikumida o\'qishning asosiy afzalliklari haqida.', category: 'Yangiliklar', author: admin._id, isPublished: true, publishedAt: new Date(), tags: ['ta\'lim', 'texnikum', 'karyera'] },
      { title: 'Grant va Stipendiyalar: Kimlar Olishi Mumkin?', content: '<p>TOPEX Texnikumida 1 milliard so\'mlik grant fondi mavjud. SAT 1200+, IELTS 7.0+ va fan olimpiadalari g\'oliblari uchun bepul o\'qish imkoniyati.</p>', excerpt: '2 million so\'mgacha grant olish imkoniyatlari haqida.', category: 'Granlar', author: admin._id, isPublished: true, publishedAt: new Date(Date.now() - 86400000), tags: ['grant', 'stipendiya', 'SAT', 'IELTS'] },
      { title: 'Bitiruvchilarimiz Qanday Natijalar Qo\'lga Kiritdi?', content: '<p>Muvaffaqiyatli bitiruvchilarimiz TOPEX Texnikumida olgan bilimlari bilan nufuzli oliy o\'quv yurtlariga kirishdi va o\'z karyeralarini muvaffaqiyatli boshlashdi.</p>', excerpt: 'Muvaffaqiyatli bitiruvchilarimizning ish va karyera tajribalari.', category: 'Yangiliklar', author: admin._id, isPublished: true, publishedAt: new Date(Date.now() - 172800000), tags: ['bitiruvchilar', 'muvaffaqiyat', 'karyera'] },
    ];
    for (const a of articles) await Article.create(a);
    console.log(`✅ ${articles.length} ta maqola yaratildi`);
  } else {
    console.log(`ℹ️  Maqolalar allaqachon mavjud: ${articlesCount} ta`);
  }

  const HomeVideo = require('../models/HomeVideo');

  const homeVideosCount = await HomeVideo.countDocuments();
  if (homeVideosCount === 0) {
    const videos = [
      { url: '/assets/images/AQM2loG1aPrNuG2FTRwfoI0IVFG5Q0Sj3Ru3sDUJa8MTtZGtFt3NfdibVyfBr08.mp4?v=2', title: 'Amaliy darslar', order: 1 },
      { url: '/assets/images/AQNVohQJLVps32Fjk5QM6GotJ1A2VROgEZbGgigO7EqoawCIRlrzwPEblUpONxr.mp4?v=2', title: 'Tadbirlar', order: 2 },
      { url: '/assets/images/AQOg3sZQMrzC4wXOlnIa_Q4_3rhnd0iUd1hCvLkg_e5XHST8RTuI_ycE8hdNHSa.mp4?v=2', title: 'Oromgoh', order: 3 },
      { url: '/assets/images/AQPNyI22OTZPaXj3NUGSKD3kFs6bzqdxkodds_uuUV0Lwq0eDy_WaArlTHUMil96DCvNrrnHjCT.mp4?v=2', title: 'Dars jarayoni', order: 4 },
      { url: '/assets/images/AQPTt2KL3eeR5E_oD0skwnKQNJposlGgzp0MHWhSu2_2znBnZoj98qXDJk8cqrf.mp4?v=2', title: 'Bitiruv kechasi', order: 5 },
    ];
    for (const v of videos) await HomeVideo.create(v);
    console.log(`✅ ${videos.length} ta video yaratildi`);
  } else {
    console.log(`ℹ️  Videolar allaqachon mavjud: ${homeVideosCount} ta`);
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
      console.log(`  Login:  ${process.env.ADMIN_LOGIN || 'admin'}`);
      console.log(`  Phone:  ${process.env.ADMIN_PHONE || '+998 99 999 99 99'}`);
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
