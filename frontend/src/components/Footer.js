import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">✦</span>
              <span>GLIMMR</span>
            </div>
            <p className="footer-tagline">
              Experience the sparkle before you wear it. AR-powered jewellery try-on for the modern shopper.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" title="Instagram">📸</a>
              <a href="#" className="social-link" title="Facebook">📘</a>
              <a href="#" className="social-link" title="YouTube">▶️</a>
              <a href="#" className="social-link" title="Pinterest">📌</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/catalogue">All Collections</Link></li>
              <li><Link to="/catalogue?category=earring">Earrings</Link></li>
              <li><Link to="/catalogue?category=necklace">Necklaces</Link></li>
              <li><Link to="/catalogue?category=ring">Rings</Link></li>
              <li><Link to="/catalogue?category=bracelet">Bracelets</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Experience</h4>
            <ul>
              <li><Link to="/tryon">AR Try-On</Link></li>
              <li><Link to="/recommend">Style Guide</Link></li>
              <li><Link to="/catalogue?style=bridal">Bridal Collection</Link></li>
              <li><Link to="/catalogue?style=minimalist">Minimalist</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Care Instructions</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 GLIMMR. Capstone Project — Thapar Institute of Engineering and Technology, Patiala</p>
          <p className="footer-credits">Built with 💎 by Ayush, Kashish, Hemant, Manav & Vishal | CPG No. 168</p>
        </div>
      </div>
    </footer>
  );
}
