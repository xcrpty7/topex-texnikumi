const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // ── Aloqa ──────────────────────────────────────────────
  phone:        { type: String, default: '+998 78 777 44 77' },
  phone2:       { type: String, default: '' },
  email:        { type: String, default: 'info@topex.uz' },
  address:      { type: String, default: 'Сергели-3, ул. Янги Сергели Йули, д. 49' },
  workingHours: { type: String, default: 'Du-Sha: 8:00 - 18:00' },
  mapLink:      { type: String, default: '' },
  telegram:     { type: String, default: '' },
  instagram:    { type: String, default: '' },
  facebook:     { type: String, default: '' },
  youtube:      { type: String, default: '' },

  // ── Bosh sahifa — Hero ──────────────────────────────────
  heroLabel:    { type: String, default: "TOPEX TEXNIKUMI –" },
  heroTitle:    { type: String, default: "Kelajak kasbini bugun egallang — Repetitorsiz va Sifatli ta'lim!" },
  heroSubtitle: { type: String, default: "Topex Texnikumida zamonaviy yo'nalishlar, amaliy tajriba va oylik 2 000 000 so'mgacha stipendiya olish imkoniyati." },
  heroBtn:      { type: String, default: "Yo'nalishlarni ko'rish" },
  heroBtn2:     { type: String, default: "Grant uchun ro'yxatdan o'tish" },
  heroNote:     { type: String, default: "9-sinfni tamomlaganlar va 11 yillik ta'limi tugallanmay qolganlar uchun!" },
  heroImage:    { type: String, default: '/assets/posts/smm-01.jpg' },
  footerDescription: { type: String, default: "Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum. 10-11 sinflar. Sifatli ta'lim, tajribali o'qituvchilar." },
  heroBgImage:  { type: String, default: '/assets/images/DSC01093.jpg' },

  // ── SEO / Helmet ────────────────────────────────────────
  siteTitle:       { type: String, default: "Topex Texnikumi – Sifatli Ta'lim, 10–11 Sinflar" },
  siteDescription: { type: String, default: "Topex – Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum. 10-11 sinflar. Tajribali o'qituvchilar, olimpiada natijalari." },

  // ── Brend / Logotip ─────────────────────────────────────
  brandSuffix:    { type: String, default: 'TEXNIKUMI' },
  brandTagline:   { type: String, default: "Sifatli ta'lim" },
  logo:           { type: String, default: '/assets/logos/topex-logo.png' },

  // ── Footer matnlari ─────────────────────────────────────
  footerPagesTitle:     { type: String, default: 'Sahifalar' },
  footerHoursTitle:     { type: String, default: 'Ish vaqti' },
  footerLegalTitle:     { type: String, default: 'Huquqiy' },
  footerContactsTitle:  { type: String, default: 'Kontaktlar' },
  footerLegal1Label:    { type: String, default: 'Maxfiylik siyosati' },
  footerLegal1Url:      { type: String, default: '#' },
  footerLegal2Label:    { type: String, default: 'Foydalanish shartlari' },
  footerLegal2Url:      { type: String, default: '#' },
  footerCopyright:      { type: String, default: 'Topex Texnikumi. Barcha huquqlar himoyalangan.' },
  footerBottomRight:    { type: String, default: 'topex.uz' },

  // ── CoursesPage qo'shimcha matnlar ──────────────────────
  coursesHeroBadge:        { type: String, default: "O'quv kurslari" },
  coursesFacultyLabel:     { type: String, default: 'FAKULTETLAR' },
  coursesFacultyTitle:     { type: String, default: "Bizning fakultetlar" },
  coursesFacultySubtitle:  { type: String, default: "Zamonaviy kasblar bo'yicha chuqurlashtirilgan ta'lim yo'nalishlari" },
  coursesCtaLabel:         { type: String, default: 'QABUL' },
  coursesCtaPhoneBtn:      { type: String, default: "Qo'ng'iroq qilish" },
  coursesCtaHomeBtn:       { type: String, default: 'Bosh sahifa' },

  // ── BlogPage qo'shimcha ─────────────────────────────────
  blogHeroBadge:    { type: String, default: 'Yangiliklar' },

  // ── GalleryPage qo'shimcha ──────────────────────────────
  galleryHeroBadge:  { type: String, default: 'Bizning Galereya' },
  galleryPhotosLabel:{ type: String, default: 'FOTO LAVHALAR' },
  galleryPhotosTitle:{ type: String, default: 'Rasmlar galereyasi' },
  galleryStudentsTab:{ type: String, default: "O'quvchilar" },
  galleryTeachersTab:{ type: String, default: "O'qituvchilar" },

  // ── Bo'lim sarlavhalari (umumiy) ────────────────────────
  aboutLabel:        { type: String, default: "TOPEX HAQIDA" },
  videoLabel:        { type: String, default: "VIDEO GALEREYA" },
  videoTitle:        { type: String, default: "Bizning hayotimizdan lavhalar" },
  popularLabel:      { type: String, default: "★ KURSLARIMIZ" },
  popularTitle:      { type: String, default: "Mashhur kurslar" },
  popularSubtitle:   { type: String, default: "Eng so'nggi yo'nalishlar, professional o'qituvchilar va amaliy bilim — hozir saytda mavjud kurslar." },
  popularBtn:        { type: String, default: "Barcha kurslarni ko'rish" },
  featuresLabel:     { type: String, default: "Nega bizni tanlashingiz kerak?" },
  featuresTitle:     { type: String, default: "Topex texnikumining afzalliklari" },
  featuresSubtitle:  { type: String, default: "TOPEX TEXNIKUM hamasini katta bilan yozamiz" },
  grantsLabel:       { type: String, default: "STIPENDIYA VA GRANTLAR" },
  grantsTitle:       { type: String, default: "Bilimingizni daromadga aylantiring!" },
  grantsSubtitle:    { type: String, default: "Topex Texnikumida oylik kontrakt to'lovi 2 500 000 so'm. Ammo siz quyidagi sertifikatlar bilan bepul o'qishingiz yoki stipendiya olishingiz mumkin:" },
  faqLabel:          { type: String, default: "FAQ" },
  faqTitle:          { type: String, default: "Tez-tez beriladigan savollar" },

  // ── Ariza (CTA) bo'limi ────────────────────────────────
  applicationBadge:        { type: String, default: "Qabul 2026" },
  applicationTitle:        { type: String, default: "Kelajagingizni biz bilan boshlang!" },
  applicationSubtitle:     { type: String, default: "Hoziroq ro'yxatdan o'ting va bizning texnikumda sifatli ta'lim olish imkoniyatini qo'lga kiriting." },
  applicationFormTitle:    { type: String, default: "Ariza qoldirish" },
  applicationFormSubtitle: { type: String, default: "Biz 24 soat ichida siz bilan bog'lanamiz" },
  applicationSubmitBtn:    { type: String, default: "Arizani yuborish" },

  // ── Biz Haqimizda ───────────────────────────────────────
  aboutTitle:   { type: String, default: "Toshkentning zamonaviy xususiy texnikumi" },
  aboutText:    { type: String, default: "Topex texnikumi — Toshkent shahrining Chilonzor tumanida 2022-yildan beri faoliyat ko'rsatayotgan zamonaviy xususiy texnikum. Biz 600 dan ortiq o'quvchiga yuqori sifatli ta'lim berib kelmoqdamiz.\n\nTajribali pedagoglar jamoasi, zamonaviy sinf xonalar, individual yondashuv va olimpiadaga tayyorlash dasturlari orqali har bir o'quvchining potensialini ochib beramiz." },
  aboutImage:   { type: String, default: '/assets/images/DSC01036.jpg' },

  // ── Statistika ──────────────────────────────────────────
  statsStudents: { type: String, default: '600+' },
  statsBranches: { type: String, default: '3+' },
  statsTeachers: { type: String, default: '50+' },
  statsGrades:   { type: String, default: '10–11' },

  // ── Yo'nalishlar (barcha sahifalarda ishlatiladi) ───────
  subjects: {
    type: mongoose.Schema.Types.Mixed,
    default: [
      { id: 1, name: 'Dasturlash', desc: "Kod yozishdan tortib, murakkab tizimlar yaratishgacha.", duration: '2 yil', features: "Frontend & Backend, Mobil ilovalar, Portfolio yaratish", imgUrl: '/assets/images/DSC00827.jpg', iconName: 'Code' },
      { id: 2, name: 'Marketing va Agrobiznes', desc: "Zamonaviy savdo san'ati va agrar soha menejmenti.", duration: '2 yil', features: "SMM & Brending, Bozor tahlili, Eksport-import", imgUrl: '/assets/images/DSC00912.jpg', iconName: 'TrendingUp' },
      { id: 3, name: 'Kompyuter Grafikasi', desc: '3D modellashtirish, brending va vizual kontent.', duration: '2 yil', features: "Adobe Photoshop/Illustrator, 3D Blender, Motion dizayn", imgUrl: '/assets/images/DSC01093.jpg', iconName: 'Palette' },
      { id: 4, name: 'Bank Nazoratchisi', desc: 'Moliya tizimi xavfsizligi va audit mutaxassisi.', duration: '2 yil', features: "Kredit tahlili, Xavfsizlik tizimlari, Bank auditi", imgUrl: '/assets/famali-photo/DSC00875.jpg', iconName: 'ShieldCheck' },
      { id: 5, name: 'Mehmonxona Boshqaruvi', desc: "Xalqaro servis va mehmondo'stlik san'ati.", duration: '2 yil', features: "Service Management, Event planning, Xorijiy tillar", imgUrl: '/assets/famali-photo/DSC00954.jpg', iconName: 'Hotel' },
      { id: 6, name: 'Raqamli Axborotlar Analitigi', desc: "Ma'lumotlar tahlili va biznes-bashorat.", duration: '2 yil', features: "Big Data, Excel & SQL, Biznes strategiya", imgUrl: '/assets/famali-photo/DSC00955.jpg', iconName: 'BarChart3' },
      { id: 7, name: 'Laborant-Analitik', desc: 'Tibbiy va sanoat tahlillari ustasi.', duration: '2 yil', features: "Kimyoviy tahlil, Sanoat laboratoriyasi, Sifat nazorati", imgUrl: '/assets/famali-photo/DSC00964.jpg', iconName: 'FlaskConical' },
      { id: 8, name: "Dorivor O'simliklar Laboranti", desc: 'Farmatsevtika va fitoterapiya sirlari.', duration: '2 yil', features: "Botanika, Dori tayyorlash, Fitoterapiya", imgUrl: '/assets/famali-photo/DSC00980.jpg', iconName: 'Sprout' },
    ],
  },

  // ── Qo'shimcha imkoniyatlar ─────────────────────────────
  extras: {
    type: mongoose.Schema.Types.Mixed,
    default: ["IT va Robototexnika", "Ingliz tili (IELTS tayyorlov)", "Matematika olimpiadasi", "Shaxmat", "Stol tennisi", "Ijodiy to'garaklar"],
  },

  // ── Afzalliklar ─────────────────────────────────────────
  features: {
    type: mongoose.Schema.Types.Mixed,
    default: [
      { title: "Tajribali o'qituvchilar", desc: "Har bir fandan yuqori malakali va tajribali pedagoglar jamoasi" },
      { title: "Zamonaviy sinf xonalar",  desc: "Eng zamonaviy jihozlar, laboratoriya va multimedia vositalari" },
      { title: "Individual yondashuv",    desc: "Har bir o'quvchiga alohida e'tibor va o'quv rejasi" },
      { title: "Olimpiada natijalari",    desc: "Respublika va xalqaro olimpiadalarda yuksak yutuqlar" },
    ],
  },

  // ── Grant kartalari ─────────────────────────────────────
  scholarshipCards: {
    type: mongoose.Schema.Types.Mixed,
    default: [
      { title: 'SAT 1200+',       subtitle: '',            amount: '2 MLN',   amountUnit: 'so\'m', badge: "Deyarli bepul o'qish", colorType: 'blue' },
      { title: 'Chet tili C1',    subtitle: 'IELTS 7.0+',  amount: '1 MLN',   amountUnit: 'so\'m', badge: 'Katta chegirma',        colorType: 'teal' },
      { title: 'Chet tili B2',    subtitle: 'IELTS 5.5-6.5', amount: '500 MING', amountUnit: 'so\'m', badge: 'Stipendiya',         colorType: 'blue2' },
      { title: 'Fan sertifikati', subtitle: 'B+ darajasi', amount: '500 MING', amountUnit: 'so\'m', badge: 'Stipendiya',           colorType: 'coral' },
    ],
  },

  // ── Kurslar sahifasi ────────────────────────────────────
  coursesHeroTitle:    { type: String, default: "Yo'nalishlar" },
  coursesHeroSubtitle: { type: String, default: "10-sinfdan 11-sinfgacha bo'lgan barcha fanlar bo'yicha chuqurlashtirilgan ta'lim dasturlari." },
  coursesHeroImage:    { type: String, default: '/assets/images/DSC01036.jpg' },
  coursesHighlights: {
    type: mongoose.Schema.Types.Mixed,
    default: [
      { img: '/assets/icons/icon-02.jpg', title: 'Kimyo',       students: '120+' },
      { img: '/assets/icons/icon-04.jpg', title: 'Adabiyot',    students: '85+' },
      { img: '/assets/icons/icon-06.jpg', title: 'Olimpiadalar', students: '200+' },
      { img: '/assets/icons/icon-08.jpg', title: 'Tadqiqot',    students: '60+' },
    ],
  },
  coursesCtaTitle:    { type: String, default: "Farzandingizni Topexga yozing!" },
  coursesCtaSubtitle: { type: String, default: "Ariza qoldiring — biz siz bilan bog'lanamiz" },
  coursesCtaPhone:    { type: String, default: '+998787774477' },

  // ── Diplom bo'limi (bosh sahifa) ────────────────────────
  diplomaTitle: { type: String, default: "Davlat namunasidagi diplom" },
  diplomaText:  { type: String, default: "Topex bitiruvchilari davlat namunasidagi diplom oladilar — bu hujjat raqamli texnologiyalar, dasturlash va boshqa sohalardagi amaliy ko'nikmalarni tasdiqlaydi. Ushbu diplom sizga yetakchi IT-kompaniyalar va yuqori texnologik tarmoqlarda ish topish hamda mehnat bozorida raqobatbardosh ustunlik uchun eshik ochadi.\n\nTopex dasturi har qanday dastlabki tayyorgarlikdagi ishtirokchilar uchun mos. Yangi boshlovchilar nol darajadan yangi kasbni egallashlari mumkin, amaliyotchi mutaxassislar esa raqamli texnologiyalar sohasida malakalarini oshirib, yo'nalishini o'zgartira oladilar." },
  diplomaImage1: { type: String, default: '' },
  diplomaImage2: { type: String, default: '' },
  diplomaCard1Title: { type: String, default: 'Davlat tan olishi' },
  diplomaCard1Desc:  { type: String, default: 'Rasmiy hujjat' },
  diplomaCard2Title: { type: String, default: "Kasbiy ko'nikmalar" },
  diplomaCard2Desc:  { type: String, default: 'Amaliy tasdiqlash' },

  // ── Ish bilan ta'minlash bo'limi (bosh sahifa) ──────────
  employmentTitle: { type: String, default: "Ish bilan ta'minlash" },
  employmentText:  { type: String, default: "Topexda o'qish davomida har bir ishtirokchi majburiy amaliyotni o'taydi — tanlagan yo'nalishi bo'yicha 3 oy davomida IT-kompaniyada ishlaydi. Topex uchun amaliyot xuddi o'quv loyihasi kabi muhim. Ishtirokchi amaliyot uchun kompaniyani o'zi tanlaydi va uning shartlari bo'yicha kelishuvga keladi. Yordam kerak bo'lsa, Topex sizga yordam beradi:" },
  employmentBullets: {
    type: mongoose.Schema.Types.Mixed,
    default: [
      "karyera maslahatini o'tkazadi va rezyumeni baholaydi;",
      "suhbatga tayyorlaydi;",
      "ish beruvchilar bilan tadbirlar tashkil qiladi va hamkor-kompaniyalardagi vakansiyalarni taklif qiladi.",
    ],
  },
  employmentFooter: { type: String, default: "Topex bitiruvchilarining 100 % i amaliyotga chiqadi va 95 % i bitirgunga qadar doimiy ish takliflarini oladi." },
  employmentImage:  { type: String, default: '' },

  // ── Galereya sahifasi ───────────────────────────────────
  galleryHeroTitle:    { type: String, default: "Topex hayoti kadrlarda" },
  galleryHeroSubtitle: { type: String, default: "Ta'lim jarayoni, tadbirlar va talabalarimizning muvaffaqiyatlaridan eng yorqin lavhalar." },
  galleryHeroImage:    { type: String, default: '/assets/images/DSC01036.jpg' },

  // ── Blog sahifasi ───────────────────────────────────────
  blogHeroTitle:    { type: String, default: 'Yangiliklar' },
  blogHeroSubtitle: { type: String, default: "Texnikumimiz hayotidan eng so'nggi yangiliklar, yutuqlar va tadbirlar." },
  blogHeroImage:    { type: String, default: '/assets/images/DSC01036.jpg' },

  // ── Aloqalar sahifasi (Contact page) ────────────────────
  contactHeroTitle:    { type: String, default: 'Aloqalar' },
  contactHeroSubtitle: { type: String, default: "Savollaringiz bormi? Biz bilan bog'laning — sizga yordam berishdan mamnunmiz." },
  contactHeroImage:    { type: String, default: '/assets/images/DSC01036.jpg' },
  contactCard1Title:   { type: String, default: 'Bizning manzil' },
  contactCard2Title:   { type: String, default: 'Telefon raqam' },
  contactCard3Title:   { type: String, default: 'E-mail' },
  contactCard4Title:   { type: String, default: 'Ish vaqti' },
  contactMapTitle:     { type: String, default: 'BIZ XARITADA!' },

  // ═════════════════════════════════════════════════════════════════════
  // ──   PROFI-STYLE BO'LIMLAR (Topex 2026 redizayn)                    ──
  // ═════════════════════════════════════════════════════════════════════

  // ── Hero swiper — 3 slayd ───────────────────────────────
  heroSlides: {
    type: [
      {
        title1: { type: String, default: '' },
        title2: { type: String, default: '' },
        title3: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        image: { type: String, default: '' },
      },
    ],
    default: [
      { title1: 'KELAJAK', title2: 'KASBINI BUGUN', title3: 'EGALLANG!', subtitle: "Topex Texnikumida zamonaviy yo'nalishlar, amaliy tajriba va oylik 2 000 000 so'mgacha stipendiya.", image: '/assets/images/DSC00827.jpg' },
      { title1: 'REPETITORSIZ', title2: 'VA SIFATLI', title3: "TA'LIM", subtitle: "10-11 sinflar uchun professional yo'nalishlar va xalqaro standartlar.", image: '/assets/images/DSC01036.jpg' },
      { title1: 'ZAMONAVIY', title2: 'TEXNIKUM', title3: 'TOSHKENTDA', subtitle: "3+ filial, 50+ professional o'qituvchi, 600+ o'quvchi.", image: '/assets/images/DSC01093.jpg' },
    ],
  },
  heroCtaText: { type: String, default: 'Ariza topshirish' },
  heroNoteText: { type: String, default: "9-sinfni tamomlaganlar va 11 yillik ta'limi tugallanmay qolganlar uchun!" },

  // ── About — "Texnikum haqida" bo'limi ────────────────────
  aboutSectionLabel: { type: String, default: 'Nima uchun biz' },
  aboutSectionTitle: { type: String, default: 'Texnikum haqida' },
  aboutSlogan:       { type: String, default: "Topex Texnikumi — Sifatli ta'lim, real natija!" },
  aboutParagraph: {
    type: String,
    default: "Topex texnikumi — Toshkent shahrining Chilonzor tumanida 2022-yildan beri faoliyat ko'rsatayotgan zamonaviy xususiy texnikum. Biz 600 dan ortiq o'quvchiga 10-11 sinflar uchun yuqori sifatli ta'lim, professional yo'nalishlar va olimpiadaga tayyorgarlik bo'yicha xizmatlar ko'rsatib kelmoqdamiz.",
  },
  aboutBtnText: { type: String, default: 'Batafsil' },
  aboutStat1Value: { type: String, default: '600' },
  aboutStat1Label: { type: String, default: "O'quvchi" },
  aboutStat2Value: { type: String, default: '50' },
  aboutStat2Label: { type: String, default: "O'qituvchi" },
  aboutImage1: { type: String, default: '/assets/images/DSC00827.jpg' },
  aboutImage2: { type: String, default: '/assets/images/DSC00912.jpg' },
  aboutImage3: { type: String, default: '/assets/images/DSC01036.jpg' },
  aboutImage4: { type: String, default: '/assets/images/DSC01093.jpg' },

  // ── Directions section header (list comes from Direction model) ───
  directionsLabel: { type: String, default: 'Topex Texnikumida' },
  directionsTitle: { type: String, default: "Yo'nalishlar" },

  // ── Team section header (list comes from Teacher model) ───
  teamLabel:      { type: String, default: 'Bizning mutaxassislar' },
  teamTitle:      { type: String, default: 'Bizning jamoa bilan tanishing' },
  teamParagraph:  { type: String, default: "Topex Texnikumida 50 dan ortiq professional o'qituvchi va amaliyotchi mutaxassis faoliyat yuritmoqda. Bizning ustozlarimiz nafaqat nazariy ma'lumot, balki real ish tajribasi va karyera maslahatlarini ham o'rgatadi." },
  teamBtnText:    { type: String, default: 'Barcha ustozlar' },

  // ── News header ───────────────────────────────────────────
  newsLabel:    { type: String, default: 'Bizning blog' },
  newsTitle:    { type: String, default: 'Yangiliklar' },
  newsMoreText: { type: String, default: 'Batafsil' },

  // ── Videos header ─────────────────────────────────────────
  videosLabel:    { type: String, default: 'Joriy video roliklar' },
  videosTitle:    { type: String, default: 'Talabalik hayoti' },
  videosSubtitle: { type: String, default: 'Topex hayoti' },

  // ── Application form ──────────────────────────────────────
  formLabel:        { type: String, default: 'Savolingiz bormi?' },
  formTitle:        { type: String, default: "Ma'lumotlaringizni to'ldiring" },
  formParagraph:    { type: String, default: 'Telefon raqamingizni qoldiring va biz sizni barcha qiziqtirgan savollaringizga javob beramiz!' },
  formNameLabel:    { type: String, default: 'Ismingiz' },
  formNamePh:       { type: String, default: "To'liq ismingizni qoldiring" },
  formPhoneLabel:   { type: String, default: 'Telefon raqamingiz' },
  formDirLabel:     { type: String, default: "Yo'nalish" },
  formDirPh:        { type: String, default: "Yo'nalishni tanlang" },
  formDir9:         { type: String, default: '9-sinfdan keyin (3 yil)' },
  formDir11:        { type: String, default: '11-sinfdan keyin (2 yil)' },
  formAgreeText:    { type: String, default: "Men shaxsiy ma'lumotlarni qayta ishlashga rozilik beraman va maxfiylik siyosatiga roziman." },
  formSubmitText:   { type: String, default: 'Ariza topshirish' },
  formImage:        { type: String, default: '/assets/images/form-photo.jpg' },

  // ── Footer ────────────────────────────────────────────────
  footerColAboutTitle:      { type: String, default: 'Texnikum haqida' },
  footerColApplicantsTitle: { type: String, default: 'Abituriyentlar uchun' },
  footerColStudentsTitle:   { type: String, default: 'Talabalar uchun' },
  footerColContactsTitle:   { type: String, default: 'Aloqalar' },
  footerCopyText:           { type: String, default: '©Copyright' },
  footerOfertaText:         { type: String, default: 'Ommaviy oferta' },
  footerLicenseText:        { type: String, default: 'Texnikum litsenziyasi' },
  footerLicenseImage:       { type: String, default: '' },
  address2:                 { type: String, default: "" },

  footerColAboutLinks: {
    type: [{ label: String, url: String }],
    default: [
      { label: 'Biz haqimizda', url: '/' },
      { label: 'Yangiliklar', url: '/blog' },
      { label: 'Hamkorlar', url: '/courses' },
      { label: 'Vakansiyalar', url: '/courses' },
      { label: '"Topex" jamoasi', url: '/gallery' },
      { label: 'Jurnallar', url: '/blog' },
    ],
  },
  footerColApplicantsLinks: {
    type: [{ label: String, url: String }],
    default: [
      { label: "Yo'nalishlar", url: '/courses' },
      { label: 'Savol-javoblar', url: '/#ariza' },
      { label: 'Kirish imtihon natijasi', url: '/blog' },
    ],
  },
  footerColStudentsLinks: {
    type: [{ label: String, url: String }],
    default: [
      { label: 'Shartnoma olish', url: '/profile' },
      { label: 'Talabalik hayoti', url: '/gallery' },
    ],
  },

}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
