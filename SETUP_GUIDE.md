# GLIMMR — Complete Setup Guide
### AR-Based Live 3D Jewellery Try-On

---

GLIMMR is a full-stack AR jewellery try-on platform. This guide helps you set up and run the project locally or in production.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18.x | https://nodejs.org |
| npm | ≥ 9.x | included with Node |
| MongoDB | ≥ 7.x | https://www.mongodb.com/try/download/community |
| Python | ≥ 3.11 | https://www.python.org (optional, for ML service) |
| Git | any | https://git-scm.com |

---

## Quick Start (5 minutes)

### Step 1 — Clone the repository
```bash
git clone https://github.com/hemant7199/virtual-jewellery-tryon.git
cd virtual-jewellery-tryon
```

### Step 2 — Install all dependencies
```bash
# Root dependencies (concurrently)
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..
```

### Step 3 — Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/jewellery_tryon
JWT_SECRET=your_secure_random_secret_here
FRONTEND_URL=http://localhost:3000
```

### Step 4 — Start MongoDB
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud) — paste your connection string in MONGO_URI
```

### Step 5 — Seed the database
```bash
cd dataset
node seed.js
# Expected: ✅ Seeded 28 jewellery items
```

### Step 6 — Start the development servers
```bash
# From project root — starts both backend (5000) and frontend (3000)
npm run dev
```

Expected:
```
Frontend → http://localhost:3000
Backend  → http://localhost:5000
```

Open **http://localhost:3000** in your browser.

---

## Running Individual Services

### Backend only
```bash
cd backend
npm run dev
# Server at http://localhost:5000
# API docs at http://localhost:5000/api/health
```

### Frontend only
```bash
cd frontend
npm start
# App at http://localhost:3000
```

### Python ML Service (optional)
```bash
cd dataset
pip install -r requirements.txt
python ml_service.py
# ML API at http://localhost:5001
# Endpoints: /recommend/similar, /recommend/outfit, /search, /stats
```

---

## Testing

### Backend API tests
```bash
cd backend
npm test
# Runs Jest tests in backend/tests/api.test.js
# Tests: Auth, Jewellery CRUD, Chatbot, Recommend, TryOn, Health
```

### Python ML evaluation
```bash
cd dataset
python ml_recommend.py
# Runs kNN evaluation and prints similarity metrics
```

---

## Docker Setup (Alternative)

Run the entire stack with one command:

```bash
# Build and start all services
docker-compose up --build

# In background
docker-compose up -d

# Stop all
docker-compose down
```

Services started:
- **MongoDB**: port 27017
- **Backend**: port 5000
- **Frontend**: port 3000
- **ML Service**: port 5001 (optional)

---

## Using the AR Try-On

1. Open http://localhost:3000
2. Click **"AR Try-On"** in the navbar or home page
3. Allow camera access when prompted
4. Select any jewellery from the right panel
5. The virtual jewellery appears on your face/hands in real-time

### Camera Tips
- Use good, even lighting — avoid backlight
- Keep your face centered in the frame
- For rings/bracelets: hold your hand open facing the camera
- For earrings: ensure ears are visible (pull back hair)
- 30+ FPS shown in top-right when tracking is active

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth
```
POST /auth/register      Body: { name, email, password }
POST /auth/login         Body: { email, password }
GET  /auth/me            Header: Authorization: Bearer <token>
```

### Jewellery
```
GET  /jewellery                  Query: category, material, style, minPrice, maxPrice, search, page, limit
GET  /jewellery/:id
GET  /jewellery/categories
POST /jewellery          (admin) Body: jewellery object
PUT  /jewellery/:id      (admin)
DEL  /jewellery/:id      (admin)
```

### Recommendations
```
POST /recommend/jewellery    Body: { jewelleryId, limit }
POST /recommend/outfit       Body: { jewelleryId }
POST /recommend/image-search Body: { tags, style, material, category }
```

### Chatbot
```
POST /chatbot/message   Body: { message, conversationHistory[] }
GET  /chatbot/suggestions
```

### Try-On Sessions
```
POST /tryon/session/start               Body: { userId?, deviceInfo? }
POST /tryon/session/:sessionId/item     Body: { jewelleryId, duration }
POST /tryon/session/:sessionId/feedback Body: { rating, comment, fps }
GET  /tryon/stats                       (admin)
```

### Users
```
PUT  /users/profile              Header: Auth  Body: { name, skinTone, preferences }
POST /users/favorites/:id        Header: Auth
GET  /users/favorites            Header: Auth
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Demo User | demo@glimmr.in | demo123 |
| Admin | admin@glimmr.in | admin123 |

> Note: Create these accounts after seeding using the register endpoint or through the UI.

---

## Chatbot Coupon Code
Use `GLIMMR10` in the cart for 10% discount.

---

## Project Structure
```
virtual-jewellery-tryon/
├── frontend/src/
│   ├── components/
│   │   ├── Navbar          — Navigation with cart/favorites badges
│   │   ├── Chatbot         — Floating AI jewellery assistant
│   │   ├── JewelleryCard   — Product card with AR try button
│   │   ├── ThreeViewer     — Interactive Three.js 3D renderer
│   │   ├── AROverlay       — Reusable camera AR component
│   │   ├── SearchBar       — Live search with dropdown
│   │   ├── FilterSidebar   — Category/material/price filters
│   │   ├── FeedbackModal   — Post-session star rating
│   │   ├── Toast           — Notification system
│   │   └── Footer
│   ├── pages/
│   │   ├── HomePage        — Landing with hero, stats, features
│   │   ├── TryOnPage       — CORE AR engine (MediaPipe + Canvas)
│   │   ├── CataloguePage   — Browse + filter collection
│   │   ├── ProductPage     — Detail, 3D view, outfit tab
│   │   ├── RecommendPage   — AI outfit recommendations
│   │   ├── CartPage        — Shopping cart + checkout
│   │   ├── LoginPage       — Auth with demo mode
│   │   ├── ProfilePage     — Favorites, skin tone, history
│   │   ├── AdminPage       — Admin CRUD dashboard
│   │   └── NotFoundPage    — 404 with animation
│   └── utils/
│       ├── api.js          — Axios client with JWT
│       ├── mockData.js     — Offline demo data (28 items)
│       └── useJewellery.js — Custom hooks with caching
├── backend/
│   ├── server.js           — Express + security middleware
│   ├── models/             — User, Jewellery, TryOnSession
│   ├── routes/             — Auth, Jewellery, Recommend, Chatbot, TryOn, Users
│   ├── middleware/         — JWT guard + admin role
│   └── tests/              — Jest API tests
└── dataset/
    ├── seed.js             — 28 jewellery items seeder
    ├── jewellery_catalog.csv — Full CSV dataset
    ├── outfit_rules.json   — Outfit & color harmony rules
    ├── ml_recommend.py     — Scikit-learn kNN evaluation
    ├── ml_service.py       — Flask ML microservice
    └── requirements.txt    — Python dependencies
```

---

## Troubleshooting

**Camera not working?**
- Check browser permissions (site settings → camera → allow)
- Use HTTPS in production (camera requires secure context)
- Try Chrome or Edge for best WebXR support

**MongoDB connection failed?**
- Ensure MongoDB is running: `mongod` (Windows) or `mongod --dbpath /data/db` (macOS/Linux)
- Check `MONGO_URI` in `backend/.env`
- The app works with mock data even without MongoDB

**MediaPipe not loading?**
- Requires internet connection (loads from CDN)
- Check browser console for errors
- Falls back to canvas-based AR if MediaPipe fails

**3D models not appearing?**
- The demo uses placeholder icons/canvas rendering
- To use real .glb files: place them in `frontend/public/models/`
- Update `model3dUrl` field in each jewellery record

---

## Deployment

### Frontend → Netlify
```bash
cd frontend
npm run build
# Drag & drop the build/ folder at netlify.com/drop
# Or connect GitHub repo for auto-deploy
```

### Backend → Render
1. Create new Web Service on render.com
2. Connect GitHub repo
3. Set root directory to `/backend`
4. Add environment variables from `.env.example`
5. Deploy

### MongoDB → Atlas
1. Create free cluster on mongodb.com/cloud/atlas
2. Get connection string
3. Set `MONGO_URI` in production environment

---

*© 2025 GLIMMR*
