# GLIMMR Changelog

## [1.0.0] — December 2025 — Initial Capstone Release

### ✦ Core AR System
- Real-time MediaPipe FaceMesh integration (468 facial landmarks)
- MediaPipe Hand Tracking integration (21 keypoints per hand)
- Canvas-based AR rendering fallback for unsupported browsers
- Three.js PBR 3D model viewer with drag-to-rotate
- Support for earrings, necklaces, rings, bracelets, bangles, nose rings

### ✦ Frontend (React.js)
- Homepage with hero section, AR statistics, feature showcase
- Full jewellery catalogue with 6 filter dimensions
- Product detail page with AR config tab + outfit recommendation tab
- AR Try-On page with real-time camera + jewellery selector
- Style Guide page with AI outfit and color recommendations
- Shopping cart with coupon code support (GLIMMR10)
- User authentication (register/login/demo mode)
- User profile with skin tone and style preferences
- Admin dashboard with full CRUD management
- 404 page with animated jewellery icons
- Live search with debounced dropdown
- Floating AI chatbot (rule-based NLP + Cohere AI fallback)
- Feedback modal with star rating after AR sessions
- Reusable FilterSidebar and FeedbackModal components
- Toast notification system
- Full responsive design (mobile + desktop)

### ✦ Backend (Node.js + Express)
- JWT authentication with bcryptjs password hashing
- Full CRUD REST API for jewellery catalogue
- Content-based filtering recommendation engine
- Outfit pairing recommendation engine
- Color harmony rules engine
- NLP chatbot with 15+ intent categories
- AR session tracking with FPS and accuracy logging
- Rate limiting (200 req/15 min)
- Helmet.js security headers
- Role-based access control (user/admin)

### ✦ Dataset & ML
- 28 jewellery items with full metadata and AR configs
- Jewellery catalog CSV (28 rows, 20 columns)
- Outfit rules JSON with styling tips and color harmony
- Python kNN recommendation model (scikit-learn)
- Flask ML microservice with REST API
- MongoDB seed script

### ✦ DevOps
- Docker Compose full stack setup
- Backend and frontend Dockerfiles
- GitHub Actions CI/CD pipeline
- Vercel deployment config
- Railway/Render Procfile
