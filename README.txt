══════════════════════════════════════════════════════════════════
  TOPEX Texnikumi — To'liq lokal stack
══════════════════════════════════════════════════════════════════

📁 ICHIDAGI MAZMUN
──────────────────
  backend/         — Node.js + Express + Mongoose (port 10000)
                     .env mavjud (MONGO_URI + JWT + admin)
  frontend/        — React + Vite + Tailwind (port 3000)
                     .env.production mavjud
  mongodb/         — MongoDB 7.0.14 binary (sudo'siz)
  mongodb-data/    — DB faylari + test ma'lumotlar:
                     • Super Admin: admin@topex.uz / Topex2026!
                     • 2 ta o'qituvchi (Teacher)
                     • 3 ta yo'nalish (Direction)
                     • Hero slides (admin'dan o'zgartirilgan)
                     • Settings (admin'dan o'rnatilgan)

  START.sh         — bitta buyruq bilan hammasini ishga tushirish
  STOP.sh          — hammasini to'xtatish


🚀 ISHGA TUSHIRISH
──────────────────
  1. Terminalda:
        cd "~/Рабочий стол/topex-texnikumi-full"
        ./START.sh

  2. Brauzerda:
        http://localhost:3000

  3. Admin panel:
        http://localhost:3000/login
        Email: admin@topex.uz
        Parol: Topex2026!


🛑 TO'XTATISH
─────────────
  ./STOP.sh


🔧 BOSHQA KOMPYUTERDA
─────────────────────
  Bu papkani ko'chirish kerak. Yo'naltirishlar tayyor:
  • Linux x86_64 — mongodb binary ishlaydi
  • macOS / Windows — mongodb papkasini o'chirib, MongoDB Atlas URI bering
    (backend/.env'da MONGO_URI ni o'zgartiring)

  Birinchi marta START.sh ishga tushganda:
  • backend/node_modules — npm install bilan o'rnatiladi (avtomatik)
  • frontend/node_modules — npm install bilan o'rnatiladi (avtomatik)


📂 ADMIN'DAN BOSHQARILADI
─────────────────────────
  Sayt Muhariri:
    ✨ Hero (3 Slayd)          ← har slayd: title + subtitle + rasm
    ✨ Texnikum haqida          ← matn, stats, 4 rasm
    ✨ Yo'nalishlar (sarlavha)
    ✨ Jamoa (sarlavha)
    ✨ Yangiliklar (sarlavha)
    ✨ Videolar (sarlavha)
    ✨ Ariza forma             ← labels, agree, submit, rasm
    ✨ Footer (4 ustun)        ← linklar massivi

  O'qituvchilar               ← CRUD + rasm yuklash
  Yo'nalishlar                ← CRUD + icon tanlash
  Bosh sahifa videolari       ← video CRUD
  Blog / Maqolalar            ← news CRUD
  Galereya, FAQ, Grantlar...

══════════════════════════════════════════════════════════════════
