# NexaWeb — Professional Web Development Agency

A full-stack agency website selling custom websites bundled with domain + hosting packages. Built with React (Vite) frontend, Node/Express backend, and PostgreSQL.

## 🏗️ Architecture

```
/test-project
├── client/          # React + Vite (deploy to Vercel)
│   ├── src/
│   │   ├── components/    # Navbar, Footer, WhatsApp, FadeIn, ScrollToTop
│   │   ├── pages/         # Home, Demos, Pricing, About, Order, Tracking, Admin
│   │   ├── context/       # LanguageContext (EN/BN)
│   │   ├── api.js         # API client
│   │   ├── i18n.js        # Translations
│   │   └── styles.css     # Tailwind v4 + custom animations
│   └── .env.example
├── server/          # Express + PostgreSQL (deploy to Railway)
│   ├── index.js           # API routes, DB init, email notifications
│   └── .env.example
└── README.md
```

## 🚀 Quick Start

### Frontend
```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

### Backend
```bash
cd server
cp .env.example .env   # Fill in your DB + SendGrid keys
npm install
node index.js          # http://localhost:5000
```

## 📄 Pages

| Route | Page |
|---|---|
| `/` | Homepage — Hero, pricing cards, demos, testimonials, FAQ |
| `/demos` | Demo Gallery — filterable by category & budget tier |
| `/pricing` | Pricing — comparison table, add-ons, EN/BN toggle |
| `/about` | About — team, mission, timeline, values |
| `/order` | Multi-step Order Form (4 steps) |
| `/order/track/:id` | Public Order Tracking (no login) |
| `/admin/dashboard` | Admin Dashboard (JWT auth) |
| `/terms`, `/privacy`, `/refund` | Legal pages |
| `*` | 404 Not Found |

## 🔑 Admin Login

- **Email:** admin@nexaweb.com
- **Password:** password

(Change via PostgreSQL `admin_users` table after first run)

## ✨ Features

- **Language Toggle:** English / Bangla on navbar (persistent via localStorage)
- **WhatsApp Button:** Floating click-to-chat (bottom-right, site-wide)
- **Scroll-reveal animations:** FadeIn on all sections
- **Animated trust bar:** Count-up numbers + marquee logos
- **Code splitting:** React.lazy for all pages
- **Mobile-first responsive:** Works on all screen sizes
- **SEO meta tags:** Open Graph + Twitter cards in index.html

## 🔌 API Endpoints

### Public
- `POST /api/orders` — Submit an order
- `GET /api/orders/track/:link` — Track an order (public)
- `GET /api/demos` — List demos
- `GET /api/case-studies` — List case studies

### Admin (JWT required)
- `POST /api/admin/login` — Login
- `GET /api/admin/orders` — List all orders
- `PATCH /api/admin/orders/:id/status` — Update order
- `GET /api/admin/stats` — Dashboard stats
- `POST /api/admin/demos` — Create demo
- `DELETE /api/admin/demos/:id` — Delete demo
- `POST /api/admin/case-studies` — Create case study
- `DELETE /api/admin/case-studies/:id` — Delete case study
- `POST /api/admin/reminder` — Trigger hosting expiry emails

## 📦 Environment Variables

### Server (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/agency
JWT_SECRET=your-secret
SENDGRID_API_KEY=SG.xxx
ADMIN_EMAIL=admin@youragency.com
CLIENT_FROM_EMAIL=hello@youragency.com
WHATSAPP_NUMBER=8801700000000
```

### Client (.env)
```
VITE_API_URL=/api
```

## 🚢 Deployment

- **Client:** Deploy `client/` to Vercel (set `VITE_API_URL` to your backend URL)
- **Server:** Deploy `server/` to Railway (set env vars in dashboard)
