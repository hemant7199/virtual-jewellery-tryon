# ✦ GLIMMR — AR-Based Live 3D Jewellery Try-On

<div align="center">

![GLIMMR Banner](https://img.shields.io/badge/GLIMMR-AR%20Jewellery%20Try--On-c9a84c?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2M5YTg0YyIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiLz48L3N2Zz4=)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-virtual--jewellery--tryon.netlify.app-00C7B7?style=for-the-badge&logo=netlify)](https://virtual-jewellery-tryon.netlify.app/)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-virtual--jewellery--tryon.onrender.com-46E3B7?style=for-the-badge&logo=render)](https://virtual-jewellery-tryon.onrender.com)
[![GitHub](https://img.shields.io/badge/📦%20GitHub-hemant7199%2Fvirtual--jewellery--tryon-181717?style=for-the-badge&logo=github)](https://github.com/hemant7199/virtual-jewellery-tryon)

<br/>

> **Experience the Sparkle before you wear it** ✨  
> A full-stack AR jewellery try-on platform built with React, Three.js, MediaPipe & Node.js

</div>

---

## 🔗 Live Links

| Service | URL |
|---------|-----|
| 🌐 **Frontend (Netlify)** | [virtual-jewellery-tryon.netlify.app](https://virtual-jewellery-tryon.netlify.app/) |
| ⚙️ **Backend API (Render)** | [virtual-jewellery-tryon.onrender.com](https://virtual-jewellery-tryon.onrender.com) |
| 📦 **Source Code (GitHub)** | [github.com/hemant7199/virtual-jewellery-tryon](https://github.com/hemant7199/virtual-jewellery-tryon) |

---

## 🎓 About This Project

GLIMMR is a **production-ready, full-stack Augmented Reality jewellery try-on platform** — built from the ground up with a focus on real-world performance, clean architecture, and an exceptional user experience.

The project demonstrates advanced integration of:
- **Augmented Reality & Computer Vision** — real-time face & hand tracking via MediaPipe
- **3D Rendering** — physically based materials with Three.js WebGL
- **AI & Machine Learning** — content-based recommendation engine + Cohere AI chatbot
- **Modern Full-Stack Web Development** — React 18, Node.js, MongoDB, JWT auth, Docker CI/CD

> Built entirely as a solo end-to-end project — from architecture design and 3D model creation to ML pipelines, REST APIs, and cloud deployment.

---

## 🎯 What It Does

GLIMMR is a **web-based AR jewellery try-on platform** that lets users virtually wear jewellery in real time through their camera — no app download needed. It includes:

- 🔮 **Real-time AR try-on** — earrings, necklaces, rings, bracelets, bangles, nose rings
- 💎 **28 interactive 3D models** — binary glTF 2.0 with PBR gold/silver/diamond materials
- 🤖 **AI chatbot** — rule-based NLP + Cohere AI for jewellery assistance
- 👗 **Outfit recommendations** — content-based ML engine suggests outfit pairings
- 🛒 **Full shopping flow** — catalogue, cart, coupon codes, order flow
- 👤 **User profiles** — favorites, skin tone preferences, try-on history
- 🔐 **Admin dashboard** — full CRUD management of the jewellery catalogue

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.x
- MongoDB (local or [Atlas](https://mongodb.com/atlas))
- Chrome / Edge / Firefox (for camera access)

### Run Locally

```bash
# 1. Clone
git clone https://github.com/hemant7199/virtual-jewellery-tryon.git
cd virtual-jewellery-tryon

# 2. One-command setup (copies .env, installs deps, seeds DB)
./setup.sh

# 3. Start dev servers
npm run dev
```

**Frontend →** http://localhost:3000  
**Backend API →** http://localhost:5000  
**Health check →** http://localhost:5000/api/health

---

## 📁 Project Structure

```
virtual-jewellery-tryon/
│
├── frontend/                     # React.js SPA
│   ├── public/
│   │   ├── models/               # 28 x .glb 3D jewellery models
│   │   └── images/               # 28 x .svg jewellery thumbnails
│   └── src/
│       ├── components/
│       │   ├── Navbar.js         # Responsive navigation
│       │   ├── JewelleryCard.js  # Product card with AR Try button
│       │   ├── ThreeViewer.js    # Interactive Three.js 3D renderer
│       │   ├── AROverlay.js      # Reusable camera AR overlay
│       │   ├── Chatbot.js        # Floating AI assistant
│       │   ├── SearchBar.js      # Live search with suggestions
│       │   ├── FilterSidebar.js  # Multi-dimension filter panel
│       │   ├── FeedbackModal.js  # Post-session star rating
│       │   ├── Toast.js          # Notification system
│       │   └── Footer.js
│       ├── pages/
│       │   ├── HomePage.js       # Hero, stats, features, CTA
│       │   ├── TryOnPage.js      # ★ CORE — MediaPipe AR engine
│       │   ├── CataloguePage.js  # Browse + filter collection
│       │   ├── ProductPage.js    # Detail + 3D viewer + outfit tab
│       │   ├── RecommendPage.js  # AI outfit recommendations
│       │   ├── CartPage.js       # Cart + checkout + coupons
│       │   ├── LoginPage.js      # Auth with demo mode
│       │   ├── ProfilePage.js    # Favorites + preferences
│       │   ├── AdminPage.js      # Admin CRUD dashboard
│       │   └── NotFoundPage.js   # Animated 404
│       └── utils/
│           ├── api.js            # Axios client with JWT
│           ├── mockData.js       # Offline demo data (28 items)
│           └── useJewellery.js   # Custom hooks with caching
│
├── backend/                      # Node.js + Express REST API
│   ├── server.js                 # Entry point + security middleware
│   ├── models/
│   │   ├── User.js               # User schema + bcrypt
│   │   ├── Jewellery.js          # Jewellery schema + AR config
│   │   └── TryOnSession.js       # Session tracking
│   ├── routes/
│   │   ├── auth.js               # Register / Login / Me
│   │   ├── jewellery.js          # CRUD + 6-filter search
│   │   ├── recommend.js          # Content-based filtering
│   │   ├── chatbot.js            # NLP + Cohere AI
│   │   ├── tryon.js              # Session + feedback
│   │   └── users.js              # Favorites + profile
│   ├── middleware/auth.js        # JWT + role guard
│   └── tests/api.test.js         # Jest API test suite
│
└── dataset/
    ├── seed.js                   # DB seeder — 28 jewellery items
    ├── jewellery_catalog.csv     # Full dataset in CSV
    ├── outfit_rules.json         # Outfit & color harmony rules
    ├── ml_recommend.py           # scikit-learn kNN model
    ├── ml_service.py             # Flask ML microservice
    └── requirements.txt          # Python dependencies
```

---

## 🧠 AR Engine

### Face Tracking (MediaPipe FaceMesh)
- Detects **468 facial landmarks** in real-time
- Earrings → landmarks **#234** (left ear) & **#454** (right ear)  
- Necklaces → landmark **#152** (chin base)  
- Nose rings → landmark **#49** (left nostril)

### Hand Tracking (MediaPipe Hands)
- Detects **21 hand keypoints** per hand
- Rings → landmarks **#13–16** (ring finger)
- Bracelets / Bangles → landmark **#0** (wrist)

### 3D Rendering (Three.js r128)
Uses **Physically Based Rendering (PBR)** to simulate realistic materials:

| Material | Color | Metalness | Roughness |
|----------|-------|-----------|-----------|
| Gold | `#C9A84C` | 0.90 | 0.10 |
| Silver | `#B0B8C1` | 0.95 | 0.05 |
| Diamond | `#A8D8F0` | 0.00 | 0.00 |
| Rose Gold | `#D4856A` | 0.85 | 0.15 |
| Platinum | `#C0C8D0` | 0.98 | 0.02 |
| Pearl | `#F0ECE4` | 0.10 | 0.40 |

---

## 💎 3D Model Library

**28 real GLB models** generated in Binary glTF 2.0 format with PBR materials:

| Category | Models |
|----------|--------|
| Earrings | Kundan Jhumka, Diamond Stud, Silver Hoop, Rose Gold Drop, Pearl Chandbali, Emerald Polki, Oxidized Jhumka |
| Necklaces | Diamond Pendant, Temple Necklace, Boho Layered, Kundan Choker, Rose Heart, Jadau Set, Gold Bar |
| Rings | Solitaire Engagement, Maharani Ring, Stackable Bands, Sapphire Halo, Silver Toe Ring |
| Bracelets | Diamond Tennis, Gold Kada, Silver Charm |
| Bangles | Lac Bangles, Glass Bangle Set |
| Nose Rings | Diamond Pin, Gold Nath |
| Pendants | Om Gold Pendant, Butterfly Silver Pendant |

---

## 🌐 API Reference

**Base URL:** `https://virtual-jewellery-tryon.onrender.com/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login → JWT |
| GET | `/jewellery` | List with filters |
| GET | `/jewellery/:id` | Single item |
| POST | `/recommend/jewellery` | Similar items |
| POST | `/recommend/outfit` | Outfit suggestions |
| POST | `/chatbot/message` | AI chat reply |
| POST | `/tryon/session/start` | Begin AR session |
| POST | `/tryon/session/:id/feedback` | Rate session |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, React Router 6, Three.js r128, CSS3 |
| **AR / CV** | MediaPipe FaceMesh, MediaPipe Hands, HTML5 Canvas |
| **3D** | Three.js WebGL, PBR materials, GLB/glTF 2.0 |
| **Backend** | Node.js 18, Express 4, JWT, bcryptjs, Helmet |
| **Database** | MongoDB 7, Mongoose 8 |
| **ML / AI** | Content-Based Filtering, scikit-learn kNN, Flask |
| **Chatbot** | Rule-based NLP, Cohere AI (optional) |
| **Deploy** | Netlify (frontend), Render (backend), MongoDB Atlas |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD |

---

## 📊 Performance

| Metric | Target | Achieved |
|--------|--------|---------|
| AR Frame Rate | 30 FPS | 30–60 FPS |
| API Response | < 200ms | ~80ms |
| Page Load | < 5s | ~2s |
| Tracking Accuracy | > 80% | ~85% |

---

## 🔒 Security

- JWT authentication (7-day expiry)
- bcryptjs password hashing (12 salt rounds)
- Helmet.js HTTP security headers
- Rate limiting (200 req / 15 min)
- CORS protection
- Role-based access control (user / admin)
- Camera data processed **100% locally** — never sent to any server

---

## 🧪 Testing

```bash
cd backend
npm test        # Jest API test suite
```

Tests cover: Auth, Jewellery CRUD, Chatbot, Recommendations, TryOn sessions, Health check.

---

## 🐳 Docker

```bash
# Run full stack (MongoDB + Backend + Frontend + ML Service)
docker-compose up --build
```

---

## 🙏 Credits

**Built with 💎 by GLIMMR**

> All design, architecture, implementation, testing, and deployment — crafted end-to-end as a solo full-stack project.

---

<div align="center">

**[🌐 Try Live Demo](https://virtual-jewellery-tryon.netlify.app/)** &nbsp;•&nbsp;
**[📦 GitHub Repo](https://github.com/hemant7199/virtual-jewellery-tryon)** &nbsp;•&nbsp;
**[⚙️ Backend API](https://virtual-jewellery-tryon.onrender.com)**

<br/>

*© 2025 GLIMMR*

</div>
