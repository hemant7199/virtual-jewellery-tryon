# GLIMMR — AR-Based Live 3D Jewellery Try-On

**Capstone Project | Thapar Institute of Engineering and Technology, Patiala**  
CPG No. 168 | December 2025  
Mentors: Dr. Nidhi Kalra & Dr. Pallika Chopra

---

## 👥 Team
| Name | Roll No. | Role |
|------|----------|------|
| Ayush Gupta | 102219003 | Chatbot & NLP Integration |
| Kashish Arora | 102219010 | ML / Recommendation Engine |
| Hemant | 102217141 | WebGL Optimization & Testing |
| Manav Gupta | 102217191 | 3D Models & AR Core |
| Vishal Kamboj | 102217210 | Frontend & Backend Integration |

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)
- Modern browser (Chrome, Edge, Firefox)

### 1 — Clone & Install
```bash
git clone <repo-url>
cd jewellery-3d-tryon

# Install all dependencies (root + frontend + backend)
npm run install:all
```

### 2 — Configure Environment
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and set MONGO_URI, JWT_SECRET

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env if your backend runs on a different port
```

### 3 — Seed the Database
```bash
cd dataset
node seed.js
```

### 4 — Run Development Server
```bash
# From project root — starts both backend (port 5000) and frontend (port 3000)
npm run dev

# Or individually:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:3000
```

---

## 📁 Project Structure

```
jewellery-3d-tryon/
├── frontend/                    # React.js frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.js        # Navigation bar
│       │   ├── JewelleryCard.js # Product card component
│       │   ├── Chatbot.js       # AI jewellery assistant chatbot
│       │   └── Footer.js
│       ├── pages/
│       │   ├── HomePage.js      # Landing page with AR hero
│       │   ├── TryOnPage.js     # CORE: MediaPipe AR engine
│       │   ├── CataloguePage.js # Browse & filter jewellery
│       │   ├── ProductPage.js   # Individual product detail
│       │   ├── RecommendPage.js # AI outfit recommendations
│       │   ├── LoginPage.js     # Auth (login & register)
│       │   ├── ProfilePage.js   # User dashboard & favorites
│       │   └── AdminPage.js     # Admin CRUD for catalogue
│       ├── utils/
│       │   ├── api.js           # Axios API wrapper
│       │   └── mockData.js      # Offline demo data
│       └── styles/
│           └── globals.css      # Luxury dark theme
│
├── backend/                     # Node.js + Express API
│   ├── server.js                # Main entry point
│   ├── models/
│   │   ├── User.js              # User schema + bcrypt
│   │   ├── Jewellery.js         # Jewellery schema + AR config
│   │   └── TryOnSession.js      # AR session tracking
│   ├── routes/
│   │   ├── auth.js              # Register / Login / Me
│   │   ├── jewellery.js         # CRUD + filtered search
│   │   ├── recommend.js         # Content-based filtering engine
│   │   ├── chatbot.js           # NLP chatbot + Cohere AI
│   │   ├── tryon.js             # Session tracking + analytics
│   │   └── users.js             # Favorites + profile
│   └── middleware/
│       └── auth.js              # JWT guard + admin role
│
└── dataset/
    ├── seed.js                  # 28 jewellery items + outfit rules
    └── README.md                # Dataset documentation
```

---

## 🔑 Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AR / CV | MediaPipe FaceMesh | 468 facial landmarks for earring/nose placement |
| AR / CV | MediaPipe Hands | 21 hand keypoints for ring/bracelet placement |
| 3D Render | Three.js + WebGL | PBR rendering, gold shine, diamond glint |
| Frontend | React.js | Component-based SPA with routing |
| Backend | Node.js + Express | REST API server |
| Database | MongoDB + Mongoose | Data storage, user profiles, sessions |
| Auth | JWT + bcryptjs | Secure authentication |
| Chatbot | Rule-based NLP + Cohere AI | Jewellery assistant |
| ML | Content-Based Filtering | Outfit & jewellery recommendations |
| Deployment | Vercel / Firebase / AWS | Frontend hosting |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login & receive JWT |
| GET | `/api/auth/me` | Get current user |

### Jewellery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jewellery` | Get all (filters: category, material, style, price) |
| GET | `/api/jewellery/:id` | Get single item |
| POST | `/api/jewellery` | Create (admin only) |
| PUT | `/api/jewellery/:id` | Update (admin only) |
| DELETE | `/api/jewellery/:id` | Delete (admin only) |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommend/jewellery` | Similar jewellery (content-based) |
| POST | `/api/recommend/outfit` | Outfit suggestions for a piece |
| POST | `/api/recommend/image-search` | Find by feature tags |

### Chatbot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/message` | Send message, receive AI reply |
| GET | `/api/chatbot/suggestions` | Get quick reply suggestions |

### TryOn Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tryon/session/start` | Begin AR session |
| POST | `/api/tryon/session/:id/item` | Log jewellery tried |
| POST | `/api/tryon/session/:id/feedback` | Submit rating |

---

## 🎨 AR Engine Details

### Face Tracking (FaceMesh)
- **468 landmark detection** using `@mediapipe/face_mesh`
- Earrings anchored to landmarks **#234 (left ear)** and **#454 (right ear)**
- Necklaces anchored to landmark **#152 (chin base)**
- Nose rings anchored to landmark **#49 (left nostril)**

### Hand Tracking
- **21 keypoints per hand** using `@mediapipe/hands`
- Rings anchored to **landmark #13-16** (ring finger)
- Bracelets/bangles anchored to **landmark #0** (wrist)

### 3D Rendering
- Canvas-based rendering using **HTML5 Canvas API** (demo mode)
- Production: **Three.js + WebGL** with PBR materials
- **30+ FPS** target on standard devices

### Material Colors (PBR simulation)
| Material | Main | Highlight | Dark |
|----------|------|-----------|------|
| Gold | #c9a84c | #f0d080 | #8a6a1e |
| Silver | #b0b8c1 | #e8edf0 | #6a7680 |
| Diamond | #a8d8f0 | #ffffff | #4a90b8 |
| Rose Gold | #d4856a | #f0b09a | #9a4a30 |

---

## 🤖 Chatbot

The chatbot uses a **two-tier approach**:
1. **Cohere AI** (if `COHERE_API_KEY` is set) — contextual, conversational responses
2. **Rule-based NLP fallback** — handles 15+ intent categories without any API key

Supported intents: greetings, how-to-tryon, gold, silver, diamond, earring, necklace, ring, care, size, shipping, price, recommendation, bridal, and more.

---

## 📊 Dataset

28 jewellery items seeded with:
- Full AR placement configs
- Style, material, occasion metadata
- Outfit pairing rules
- Color harmony mappings

See `dataset/README.md` for full documentation.

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy /build folder to Vercel
```

### Backend (Railway / Render)
```bash
# Set environment variables in hosting dashboard
# Start command: node server.js
```

### MongoDB (Atlas)
```
Set MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/jewellery_tryon
```

---

## 🔒 Security Features
- JWT authentication with 7-day expiry
- Password hashing with bcryptjs (12 rounds)
- Helmet.js HTTP headers
- Rate limiting (200 req/15 min)
- CORS protection
- Role-based access control (user / admin)
- HTTPS enforced in production
- Camera data processed **locally only** — never transmitted

---

## 📈 Performance Metrics
| Metric | Target | Achieved |
|--------|--------|---------|
| AR Frame Rate | 30 FPS | 30–60 FPS |
| API Response Time | < 200ms | ~80ms |
| Page Load Time | < 5s | ~2s |
| Jewellery Placement Accuracy | > 80% | ~85% |

---

## 📝 License
Academic project — Thapar Institute of Engineering and Technology  
© 2025 Ayush Gupta, Kashish Arora, Hemant, Manav Gupta, Vishal Kamboj
