import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-glyph">✦</div>
        <h1 className="notfound-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <button className="btn btn-gold btn-lg" onClick={() => navigate('/')}>
            Go Home
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/catalogue')}>
            Browse Collection
          </button>
        </div>
        <div className="notfound-floats" aria-hidden>
          {['💎','💍','📿','✦','🌟','💎'].map((icon, i) => (
            <span key={i} className="nf-float" style={{ '--i': i }}>{icon}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
