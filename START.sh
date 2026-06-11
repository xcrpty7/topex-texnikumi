#!/bin/bash
# ════════════════════════════════════════════════════════════════
#  TOPEX Texnikumi — Full Local Stack ishga tushirish
# ════════════════════════════════════════════════════════════════

set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "════════════════════════════════════════════════════════════"
echo "  TOPEX — Ishga tushirilmoqda"
echo "════════════════════════════════════════════════════════════"

# 1. MongoDB
if pgrep -f "mongod.*$DIR/mongodb-data" > /dev/null; then
    echo "✅ MongoDB allaqachon ishlayapti"
else
    echo "▶  MongoDB ishga tushirilmoqda..."
    "$DIR/mongodb/bin/mongod" --dbpath "$DIR/mongodb-data" \
        --bind_ip 127.0.0.1 --port 27017 \
        --logpath "$DIR/mongodb-data/mongo.log" --fork > /dev/null
    sleep 1
    echo "✅ MongoDB ishga tushdi (port 27017)"
fi

# 2. Backend deps
if [ ! -d "$DIR/backend/node_modules" ]; then
    echo "▶  Backend npm install..."
    (cd "$DIR/backend" && npm install --silent)
fi

# 3. Frontend deps
if [ ! -d "$DIR/frontend/node_modules" ]; then
    echo "▶  Frontend npm install..."
    (cd "$DIR/frontend" && npm install --silent)
fi

# 4. Backend ishga tushirish (background)
echo "▶  Backend (port 10000)..."
(cd "$DIR/backend" && npm run dev > "$DIR/backend.log" 2>&1 &)
sleep 3

# 5. Frontend ishga tushirish (background)
echo "▶  Frontend (port 3000)..."
(cd "$DIR/frontend" && npm run dev > "$DIR/frontend.log" 2>&1 &)
sleep 3

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ HAMMASI ISHGA TUSHDI"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  🌐 Sayt:        http://localhost:3000"
echo "  🔐 Admin:       http://localhost:3000/login"
echo "  📧 Email:       admin@topex.uz"
echo "  🔑 Parol:       Topex2026!"
echo ""
echo "  📦 Backend API: http://localhost:10000/api"
echo "  📊 MongoDB:     mongodb://127.0.0.1:27017/topex"
echo ""
echo "  Loglar: backend.log, frontend.log"
echo "  To'xtatish uchun: ./STOP.sh"
echo ""
