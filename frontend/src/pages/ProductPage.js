import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { jewelleryAPI, recommendAPI } from '../utils/api';
import { MOCK_JEWELLERY, formatPrice, renderStars, MATERIAL_EMOJI } from '../utils/mockData';
import JewelleryCard from '../components/JewelleryCard';
import { useApp } from '../App';
import './ProductPage.css';
import ThreeViewer from '../components/ThreeViewer';

export default function ProductPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useApp();
  const [item, setItem] = useState(state?.jewellery || null);
  const [related, setRelated] = useState([]);
  const [outfit, setOutfit] = useState(null);
  const [tab, setTab] = useState('details');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await jewelleryAPI.getById(id);
        setItem(res.data.data);
        loadRelated(id);
        loadOutfit(id);
      } catch {
        const found = MOCK_JEWELLERY.find(j => j._id === id);
        if (found) { setItem(found); loadRelated(id); loadOutfit(id); }
      }
    };
    if (!item) load();
    else { loadRelated(id); loadOutfit(id); }
  }, [id]);

  const loadRelated = async (jid) => {
    try {
      const res = await recommendAPI.jewellery(jid, 4);
      setRelated(res.data.data);
    } catch {
      setRelated(MOCK_JEWELLERY.filter(j => j._id !== jid).slice(0, 4));
    }
  };

  const loadOutfit = async (jid) => {
    try {
      const res = await recommendAPI.outfit(jid);
      setOutfit(res.data.data);
    } catch {}
  };

  const handleCart = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!item) return <div className="loading-screen"><div className="spinner"></div></div>;
  const isFav = favorites.find(f => f._id === item._id);

  const iconMap = { earring:'💎', necklace:'📿', ring:'💍', bracelet:'🔮', 'nose-ring':'✦', bangle:'⭕', pendant:'🌟' };

  return (
    <div className="product-page">
      <div className="container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>← Back to Collection</button>

        <div className="product-layout">
          {/* Image / 3D Preview */}
          <div className="product-visual">
            <div className="product-image-main">
              <ThreeViewer jewellery={item} width="100%" height={340} />
            </div>
            <div className="product-visual-actions">
              <button className="btn btn-gold" onClick={() => navigate(`/tryon/${item._id}`, { state: { jewellery: item } })}>
                ✦ Try in AR
              </button>
              <button
                className={`btn btn-ghost ${isFav ? 'fav-active' : ''}`}
                onClick={() => toggleFavorite(item)}
              >
                {isFav ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            <div className="product-meta-top">
              <span className="badge badge-dark">{item.category}</span>
              <span className="badge badge-gold">{item.style}</span>
              {!item.inStock && <span className="badge" style={{ background: 'rgba(192,57,43,0.15)', color: '#e74c3c' }}>Out of Stock</span>}
            </div>

            <h1 className="product-title">{item.name}</h1>
            <div className="gold-line"></div>

            <div className="product-rating">
              <span className="stars">{'★'.repeat(Math.round(item.rating))}{'☆'.repeat(5 - Math.round(item.rating))}</span>
              <span className="rating-value">{item.rating}</span>
              <span className="rating-count">({item.reviewCount} reviews)</span>
            </div>

            <div className="product-price">{formatPrice(item.price, item.currency)}</div>

            <p className="product-description">{item.description}</p>

            {/* Attributes */}
            <div className="product-attributes">
              <div className="attr-row">
                <span className="attr-key">Material</span>
                <span className="attr-val">{MATERIAL_EMOJI[item.material]} {item.material}</span>
              </div>
              {item.gemstones?.length > 0 && (
                <div className="attr-row">
                  <span className="attr-key">Gemstones</span>
                  <span className="attr-val">{item.gemstones.join(', ')}</span>
                </div>
              )}
              <div className="attr-row">
                <span className="attr-key">Occasions</span>
                <span className="attr-val">{item.occasion?.join(', ')}</span>
              </div>
              <div className="attr-row">
                <span className="attr-key">Color Tone</span>
                <span className="attr-val">{item.colorTone}</span>
              </div>
            </div>

            {/* Add to cart */}
            <div className="product-cta">
              <button
                className={`btn btn-gold btn-lg ${added ? 'added' : ''}`}
                onClick={handleCart}
                disabled={!item.inStock}
              >
                {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate(`/tryon/${item._id}`, { state: { jewellery: item } })}>
                ✦ AR Try-On
              </button>
            </div>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="product-tags">
                {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            {['details', 'ar-info', 'outfit'].map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t === 'details' ? 'Details' : t === 'ar-info' ? 'AR Configuration' : 'Outfit Suggestions'}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {tab === 'details' && (
              <div className="details-tab">
                <h3>Product Details</h3>
                <p>{item.description}</p>
                <div className="details-grid">
                  <div><strong>Brand</strong><span>{item.brand || 'GLIMMR'}</span></div>
                  <div><strong>Category</strong><span>{item.category}</span></div>
                  <div><strong>Material</strong><span>{item.material}</span></div>
                  <div><strong>Style</strong><span>{item.style}</span></div>
                  <div><strong>In Stock</strong><span>{item.inStock ? 'Yes' : 'No'}</span></div>
                  <div><strong>Currency</strong><span>{item.currency}</span></div>
                </div>
              </div>
            )}

            {tab === 'ar-info' && (
              <div className="ar-info-tab">
                <h3>AR Placement Configuration</h3>
                <p>How this piece is anchored in augmented reality on your device.</p>
                <div className="details-grid">
                  <div><strong>Anchor Point</strong><span>{item.arConfig?.anchorLandmark || 'auto'}</span></div>
                  <div><strong>Scale</strong><span>{item.arConfig?.scale || 1.0}</span></div>
                  <div><strong>X Offset</strong><span>{item.arConfig?.offsetX || 0}</span></div>
                  <div><strong>Y Offset</strong><span>{item.arConfig?.offsetY || 0}</span></div>
                </div>
                <div className="ar-landmarks">
                  <strong>MediaPipe Landmarks Used</strong>
                  <div className="landmark-chips">
                    {item.category === 'earring' && ['#234 (Left Ear)', '#454 (Right Ear)'].map(l => <span key={l} className="badge badge-gold">{l}</span>)}
                    {(item.category === 'necklace' || item.category === 'pendant') && <span className="badge badge-gold">#152 (Chin Base)</span>}
                    {item.category === 'nose-ring' && <span className="badge badge-gold">#49 (Left Nostril)</span>}
                    {item.category === 'ring' && <span className="badge badge-gold">Hand #13-16 (Ring Finger)</span>}
                    {(item.category === 'bracelet' || item.category === 'bangle') && <span className="badge badge-gold">Hand #0 (Wrist)</span>}
                  </div>
                </div>
              </div>
            )}

            {tab === 'outfit' && outfit && (
              <div className="outfit-tab">
                <h3>Outfit Suggestions for {outfit.jewellery}</h3>
                <div className="outfit-section">
                  <strong>Recommended Outfit Types</strong>
                  <div className="outfit-chips">
                    {outfit.outfitSuggestions?.map(o => <span key={o} className="badge badge-dark">{o}</span>)}
                  </div>
                </div>
                <div className="outfit-section">
                  <strong>Complementary Colors</strong>
                  <div className="outfit-chips">
                    {outfit.colorSuggestions?.map(c => <span key={c} className="badge badge-gold">{c}</span>)}
                  </div>
                </div>
                <div className="outfit-tips">
                  <strong>Styling Tips</strong>
                  <ul>
                    {outfit.stylingTips?.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section section-sm">
            <h2>You Might Also Like</h2>
            <div className="gold-line"></div>
            <div className="jewellery-grid" style={{ marginTop: 32 }}>
              {related.map(r => <JewelleryCard key={r._id} item={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
