# AGENTS.md — Topex Texnikum

## Что это за проект
Сайт **TOPEX Texnikum** (`topextexnikum.uz`) — образовательный сайт с админкой, курсами, блогом, галереей, отзывами, FAQ, стипендиями, вакансиями.

## Стек
- **Frontend**: React + Vite + Tailwind → деплой на **Vercel** (`topextexnikum.uz`)
- **Backend**: Express + Node.js + MongoDB → деплой на **Render** (`topex-texnikumi-api.onrender.com`)
- **БД**: MongoDB Atlas
- **Домен**: `topextexnikum.uz` (через Cloudflare DNS)
- **Repo**: `github.com/kreziy7/topex-texnikumi`

## Текущее состояние (2026-07-11)

### Cloudflare ✅
- Домен `topextexnikum.uz` через Cloudflare (ns: `joan.ns.cloudflare.com` / `mcgrory.ns.cloudflare.com`)
- **Frontend проксирован** через Cloudflare → images/videos кэшируются
- **Backend НЕ проксирован** (Render сам за Cloudflare → CNAME невозможен, Error 1000)
- SSL: **Full** (без Strict)
- Включено: HTTP/2, HTTP/3 (QUIC), 0-RTT, Early Hints, Always Use HTTPS, TLS 1.3

### DNS записи (7 шт)
| Тип | Имя | Контент | Прокси |
|-----|-----|---------|--------|
| A | `@` | `76.76.21.21` | Да (Cloudflare) |
| CNAME | `www` | `cname.vercel-dns.com` | Да |
| CNAME | `ftp` | `ftp.vhostez.com` | Нет |
| CNAME | `mail` | `mx.vhostez.com` | Нет |
| MX | `@` | `mx.vhostez.com` (pri 10) | Нет |
| TXT | `@` | `v=spf1 mx a ip4:...` | Нет |
| TXT | `_dmarc` | `v=DMARC1; p=none;...` | Нет |

### Backend (server.js)
- Кэширование заголовков:
  - `/uploads/*` изображения: `Cache-Control: public, max-age=31536000, immutable`
  - `/uploads/*` видео: `Cache-Control: public, max-age=2592000`
  - Публичные API маршруты: `Cache-Control: public, max-age=300`
  - Добавлен `CDN-Cache-Control` для Cloudflare
- CORS: `origin: process.env.CLIENT_URL || "http://localhost:5173"`
- Безопасность: helmet, rate-limit (200 req/15min), mongoSanitize, hpp, cookie-parser

### Frontend (.env.production)
```
VITE_API_URL=https://topex-texnikumi-api.onrender.com
```
(напрямую на Render, НЕ через api subdomain)

### Render
- Сервис: `srv-d82vl8favr4c739fvg8g`
- Workspace: `tea-d70daa1aae7s73d4j3jg`
- Деплой: автоматический с `main` ветки

## Ключевые файлы
- `backend/server.js` — Express сервер, кэширование, middleware
- `backend/routes/` — API маршруты (auth, courses, blog, admin, applications, amocrm, vacancies)
- `backend/controllers/` — логика (gallery, testimonials, faq, scholarships, settings, homeVideos)
- `backend/utils/seed.js` — seed данные (teachers, directions)
- `frontend/src/` — React компоненты
- `frontend/.env.production` — URL API
- `vercel.json` — фронтенд конфиг
- `render.yaml` — бэкенд конфиг

## Где что искать
- **Баг/ошибка в API** → смотри `backend/routes/` и `backend/controllers/`
- **Проблема с отображением** → `frontend/src/`
- **Деплой не работает** → проверь Render/Vercel логи
- **Домен/DNS** → Cloudflare Dashboard (аккаунт `Gayraotabek4@gmail.com`)
- **Env vars** → Render Dashboard или Vercel Dashboard
- **Seed данные (учителя, направления)** → `backend/routes/adminRoutes.js`, `backend/utils/seed.js`

## Что НЕ трогать
- `backend/.env` — содержит MONGO_URI, JWT_SECRET и другие секреты
- `backend/routes/adminRoutes.js` seed списки — только через админку
- Cloudflare DNS записи — только через Dashboard

## Команды
```bash
# Локальная разработка
cd backend && npm run dev
cd frontend && npm run dev

# Деплой
git push origin main  # автодеплой на Vercel + Render
```
