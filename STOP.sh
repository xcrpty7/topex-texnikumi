#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "▶  Frontend, backend va MongoDB to'xtatilmoqda..."

pkill -f "vite" 2>/dev/null
pkill -f "nodemon server.js" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
"$DIR/mongodb/bin/mongod" --dbpath "$DIR/mongodb-data" --shutdown 2>/dev/null || true

echo "✅ Hammasi to'xtadi"
