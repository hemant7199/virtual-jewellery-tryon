import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JewelleryCard from '../components/JewelleryCard';
import { jewelleryAPI } from '../utils/api';
import { MOCK_JEWELLERY } from '../utils/mockData';
import './HomePage.css';

const FEATURES = [
  { icon: '🎯', title: 'Real-Time AR', desc: 'MediaPipe FaceMesh & Hand Tracking — 468 facial landmarks for pinpoint jewellery placement.' },
  { icon: '💎', title: '3D PBR Rendering', desc: 'Physically Based Rendering with Three.js simulates gold shine, diamond glint, and material depth.' },
  { icon: '🤖', title: 'AI Recommendations', desc: 'Content-based filtering engine suggests outfits and jewellery pairings personalized to your style.' },
  { icon: '🌐', title: 'No App Required', desc: 'Fully web-based. Works in any modern browser on mobile or desktop via WebXR + WebGL.' },
];

const STATS = [
  { value: '468', label: 'Facial Landmarks' },
  { value: '21', label: 'Hand Keypoints' },
  { value: '30+', label: 'FPS Rendering' },
  { value: '7', label: 'Jewellery Categories' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const res = await jewelleryAPI.getAll({ limit: 4 });
      setFeatured(res.data.data);
    } catch {
      setFeatured(MOCK_JEWELLERY.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-grid"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge fade-up">
            <span className="ar-dot"></span>
            Augmented Reality Experience
          </div>

          <h1 className="hero-title fade-up delay-1">
            Experience the<br />
            <em className="hero-gold">Sparkle</em><br />
            before you wear it
          </h1>

          <p className="hero-subtitle fade-up delay-2">
            Step into the future of jewellery shopping with our revolutionary AR try-on platform.
            See how earrings, necklaces, rings & more look on you — in real time.
          </p>

          <div className="hero-actions fade-up delay-3">
            <button className="btn btn-gold btn-lg" onClick={() => navigate('/tryon')}>
              ✦ Start AR Experience
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/catalogue')}>
              Explore Collection
            </button>
          </div>

          <div className="hero-stats fade-up delay-4">
            {STATS.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating jewellery icons */}
        <div className="hero-floats" aria-hidden>
          {['💎','💍','📿','👑','✦','🌟','💎','💍'].map((icon, i) => (
            <span key={i} className="float-icon" style={{ '--i': i }}>{icon}</span>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2>Try Before You Buy</h2>
            <div className="gold-line-center"></div>
            <p className="section-desc">Four simple steps to your perfect virtual try-on experience</p>
          </div>

          <div className="steps-grid">
            {[
              { n: '01', icon: '📱', title: 'Open the Platform', desc: 'Access GLIMMR from any browser on your phone or computer. No app download needed.' },
              { n: '02', icon: '📸', title: 'Allow Camera', desc: 'Grant camera access. Your face and hands are tracked locally — no data stored.' },
              { n: '03', icon: '💎', title: 'Select Jewellery', desc: 'Browse our collection and tap any piece to instantly overlay it in AR on yourself.' },
              { n: '04', icon: '🛒', title: 'Shop with Confidence', desc: 'Love what you see? Add to cart and checkout. Full returns within 15 days.' },
            ].map(step => (
              <div key={step.n} className="step-card">
                <span className="step-number">{step.n}</span>
                <span className="step-icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Curated</span>
            <h2>Featured Collection</h2>
            <div className="gold-line-center"></div>
          </div>

          {loading ? (
            <div className="jewellery-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="card" style={{ height: 360 }}>
                  <div className="skeleton" style={{ height: 220 }}></div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 12, width: '60%' }}></div>
                    <div className="skeleton" style={{ height: 18, width: '80%' }}></div>
                    <div className="skeleton" style={{ height: 12, width: '40%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="jewellery-grid">
              {featured.map(item => <JewelleryCard key={item._id} item={item} />)}
            </div>
          )}

          <div className="section-cta">
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/catalogue')}>
              View Entire Collection →
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Technology</span>
            <h2>Built with Cutting-Edge Tech</h2>
            <div className="gold-line-center"></div>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Shop by Type</span>
            <h2>Every Adornment, Perfectly Placed</h2>
            <div className="gold-line-center"></div>
          </div>
          <div className="categories-grid">
            {[
              { name: 'Earrings', icon: '💎', slug: 'earring', count: '6+' },
              { name: 'Necklaces', icon: '📿', slug: 'necklace', count: '5+' },
              { name: 'Rings', icon: '💍', slug: 'ring', count: '5+' },
              { name: 'Bracelets', icon: '🔮', slug: 'bracelet', count: '3+' },
              { name: 'Bangles', icon: '⭕', slug: 'bangle', count: '2+' },
              { name: 'Nose Rings', icon: '✦', slug: 'nose-ring', count: '2+' },
            ].map(cat => (
              <div
                key={cat.slug}
                className="category-card card"
                onClick={() => navigate(`/catalogue?category=${cat.slug}`)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <h4>{cat.name}</h4>
                <span className="cat-count">{cat.count} pieces</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Ready to Find Your Perfect Piece?</h2>
              <p>Join thousands of happy customers who shop with confidence using our AR try-on.</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-gold btn-lg" onClick={() => navigate('/tryon')}>
                ✦ Try On Now
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/recommend')}>
                Style Guide
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
