import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cart, favorites } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">GLIMMR</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          <Link to="/catalogue" className={`nav-link ${location.pathname === '/catalogue' ? 'active' : ''}`}>
            Collection
          </Link>
          <Link to="/tryon" className={`nav-link nav-link-ar ${location.pathname.startsWith('/tryon') ? 'active' : ''}`}>
            <span className="ar-dot"></span>AR Try-On
          </Link>
          <Link to="/recommend" className={`nav-link ${location.pathname === '/recommend' ? 'active' : ''}`}>
            Style Guide
          </Link>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <button className="nav-icon-btn" title="Favorites" onClick={() => navigate(user ? '/profile' : '/login')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </button>

          <button className="nav-icon-btn" title="Cart" onClick={() => navigate('/catalogue')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
          </button>

          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">{user.name.split(' ')[0]}</span>
              <div className="nav-user-menu">
                <Link to="/profile" className="menu-item">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" className="menu-item">Admin</Link>}
                <button onClick={handleLogout} className="menu-item menu-item-danger">Sign Out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-gold btn-sm">Sign In</Link>
          )}

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/catalogue" className="mobile-link">Collection</Link>
          <Link to="/tryon" className="mobile-link">AR Try-On</Link>
          <Link to="/recommend" className="mobile-link">Style Guide</Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-link">Profile</Link>
              <button onClick={handleLogout} className="mobile-link danger">Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="mobile-link highlight">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
