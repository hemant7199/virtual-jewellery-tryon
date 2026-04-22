import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { formatPrice, MATERIAL_EMOJI } from '../utils/mockData';
import './JewelleryCard.css';

// Derive SVG image path from model3dUrl or category+name
function getImageUrl(item) {
  if (item.images && item.images.length > 0 && item.images[0]) {
    // Convert /images/...jpg → /images/...svg for our generated assets
    return item.images[0].replace(/\.(jpg|jpeg|png)$/, '.svg');
  }
  // Derive from model3dUrl e.g. /models/earrings/kundan_jhumka.glb → /images/earrings/kundan_jhumka.svg
  if (item.model3dUrl) {
    return item.model3dUrl
      .replace('/models/', '/images/')
      .replace('.glb', '.svg');
  }
  return null;
}

const GRADIENTS = {
  earring:    'linear-gradient(135deg, #1a1408 0%, #2a1f08 100%)',
  necklace:   'linear-gradient(135deg, #0d1a1a 0%, #0d2a2a 100%)',
  ring:       'linear-gradient(135deg, #0d0d1a 0%, #0d0d2a 100%)',
  bracelet:   'linear-gradient(135deg, #1a0d1a 0%, #2a0d2a 100%)',
  'nose-ring':'linear-gradient(135deg, #1a1a0d 0%, #2a2a0d 100%)',
  bangle:     'linear-gradient(135deg, #1a0d0d 0%, #2a0d0d 100%)',
  pendant:    'linear-gradient(135deg, #0d1a0d 0%, #0d2a0d 100%)',
};

const ICONS = {
  earring:'💎', necklace:'📿', ring:'💍',
  bracelet:'🔮', 'nose-ring':'✦', bangle:'⭕', pendant:'🌟'
};

export default function JewelleryCard({ item, showTryOn = true }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useApp();
  const [imgError, setImgError] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const isFav = favorites.find(f => f._id === item._id);
  const imgUrl = getImageUrl(item);

  const handleTryOn = (e) => {
    e.stopPropagation();
    navigate(`/tryon/${item._id}`, { state: { jewellery: item } });
  };
  const handleFav = (e) => { e.stopPropagation(); toggleFavorite(item); };
  const handleCart = (e) => {
    e.stopPropagation();
    addToCart(item);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1500);
  };

  return (
    <div className="jewellery-card card"
      onClick={() => navigate(`/catalogue/${item._id}`, { state: { jewellery: item } })}>

      {/* Image / Visual */}
      <div className="jcard-image" style={{ background: GRADIENTS[item.category] || GRADIENTS.earring }}>
        {imgUrl && !imgError ? (
          <img
            src={imgUrl}
            alt={item.name}
            className="jcard-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="jcard-placeholder">
            <span className="jcard-icon">{ICONS[item.category] || '💎'}</span>
            <span className="jcard-material-tag">{MATERIAL_EMOJI[item.material]} {item.material}</span>
          </div>
        )}

        <button className={`jcard-fav ${isFav ? 'active' : ''}`} onClick={handleFav}
          title={isFav ? 'Remove from favorites' : 'Save'}>
          {isFav ? '♥' : '♡'}
        </button>

        {item.style === 'bridal' && <span className="jcard-label">Bridal</span>}
        {item.price >= 50000 && <span className="jcard-label luxury">Luxury</span>}

        {/* 3D badge */}
        {item.model3dUrl && (
          <span className="jcard-3d-badge">3D</span>
        )}
      </div>

      {/* Info */}
      <div className="jcard-body">
        <div className="jcard-meta">
          <span className="jcard-category">{item.category}</span>
          <span className="jcard-rating">
            <span className="stars">{'★'.repeat(Math.round(item.rating || 4))}</span>
            <span className="jcard-rating-count">({item.reviewCount || 0})</span>
          </span>
        </div>

        <h3 className="jcard-name">{item.name}</h3>

        {item.gemstones && item.gemstones.length > 0 && (
          <div className="jcard-gems">
            {item.gemstones.slice(0, 3).map(g => (
              <span key={g} className="tag">{g}</span>
            ))}
          </div>
        )}

        <div className="jcard-footer">
          <span className="price">{formatPrice(item.price, item.currency)}</span>
          <div className="jcard-actions">
            {showTryOn && (
              <button className="btn btn-outline btn-sm" onClick={handleTryOn}>AR Try</button>
            )}
            <button
              className={`btn btn-sm ${cartAdded ? 'btn-ghost' : 'btn-gold'}`}
              onClick={handleCart}
            >
              {cartAdded ? '✓' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
