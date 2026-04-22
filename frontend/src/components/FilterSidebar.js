import React from 'react';
import './FilterSidebar.css';

const CATEGORIES = ['earring','necklace','ring','bracelet','nose-ring','bangle','pendant'];
const MATERIALS  = ['gold','silver','diamond','rose-gold','white-gold','platinum','pearl'];
const STYLES     = ['traditional','contemporary','bridal','casual','minimalist','fusion'];
const OCCASIONS  = ['wedding','daily','party','office','festival','gifting'];
const PRICE_RANGES = [
  { label: 'Under ₹5,000',          min: 0,      max: 5000   },
  { label: '₹5,000 – ₹20,000',      min: 5000,   max: 20000  },
  { label: '₹20,000 – ₹60,000',     min: 20000,  max: 60000  },
  { label: '₹60,000 – ₹1,50,000',   min: 60000,  max: 150000 },
  { label: 'Above ₹1,50,000',        min: 150000, max: null   },
];

export default function FilterSidebar({ filters, onChange, onClear, resultCount }) {
  const set = (key, value) => {
    onChange({
      ...filters,
      [key]: filters[key] === value ? '' : value,
    });
  };

  const setPriceRange = (range) => {
    const key = `${range.min}-${range.max}`;
    const current = `${filters.minPrice}-${filters.maxPrice}`;
    if (current === key) {
      onChange({ ...filters, minPrice: '', maxPrice: '' });
    } else {
      onChange({ ...filters, minPrice: range.min, maxPrice: range.max || '' });
    }
  };

  const activeCount = [
    filters.category, filters.material, filters.style,
    filters.occasion, filters.minPrice,
  ].filter(Boolean).length;

  return (
    <aside className="filter-sidebar">
      <div className="fsb-header">
        <h3>Filters</h3>
        <div className="fsb-header-right">
          {activeCount > 0 && (
            <span className="fsb-active-count">{activeCount} active</span>
          )}
          {activeCount > 0 && (
            <button className="fsb-clear-btn" onClick={onClear}>Clear all</button>
          )}
        </div>
      </div>

      {resultCount !== undefined && (
        <div className="fsb-results-count">{resultCount} results</div>
      )}

      {/* Category */}
      <div className="fsb-group">
        <h4 className="fsb-group-title">Category</h4>
        <div className="fsb-options">
          {CATEGORIES.map(cat => (
            <label key={cat} className={`fsb-option ${filters.category === cat ? 'active' : ''}`}>
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => set('category', cat)}
              />
              <span className="fsb-option-icon">
                {cat==='earring'?'💎':cat==='necklace'?'📿':cat==='ring'?'💍':cat==='bracelet'?'🔮':cat==='nose-ring'?'✦':cat==='bangle'?'⭕':'🌟'}
              </span>
              <span className="fsb-option-label">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="fsb-divider"></div>

      {/* Material */}
      <div className="fsb-group">
        <h4 className="fsb-group-title">Material</h4>
        <div className="fsb-chips">
          {MATERIALS.map(m => (
            <button
              key={m}
              className={`fsb-chip ${filters.material === m ? 'active' : ''}`}
              onClick={() => set('material', m)}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className="fsb-divider"></div>

      {/* Style */}
      <div className="fsb-group">
        <h4 className="fsb-group-title">Style</h4>
        <div className="fsb-chips">
          {STYLES.map(s => (
            <button
              key={s}
              className={`fsb-chip ${filters.style === s ? 'active' : ''}`}
              onClick={() => set('style', s)}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="fsb-divider"></div>

      {/* Occasion */}
      <div className="fsb-group">
        <h4 className="fsb-group-title">Occasion</h4>
        <div className="fsb-chips">
          {OCCASIONS.map(o => (
            <button
              key={o}
              className={`fsb-chip ${filters.occasion === o ? 'active' : ''}`}
              onClick={() => set('occasion', o)}
            >{o}</button>
          ))}
        </div>
      </div>

      <div className="fsb-divider"></div>

      {/* Price */}
      <div className="fsb-group">
        <h4 className="fsb-group-title">Price Range</h4>
        <div className="fsb-price-list">
          {PRICE_RANGES.map(range => {
            const key = `${range.min}-${range.max}`;
            const currentKey = `${filters.minPrice}-${filters.maxPrice}`;
            const isActive = currentKey === key;
            return (
              <label key={key} className={`fsb-price-option ${isActive ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="price"
                  checked={isActive}
                  onChange={() => setPriceRange(range)}
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="fsb-divider"></div>

      {/* Rating */}
      <div className="fsb-group">
        <h4 className="fsb-group-title">Minimum Rating</h4>
        <div className="fsb-rating-options">
          {[4.5, 4.0, 3.5].map(r => (
            <label key={r} className={`fsb-price-option ${Number(filters.minRating) === r ? 'active' : ''}`}>
              <input
                type="radio"
                name="rating"
                checked={Number(filters.minRating) === r}
                onChange={() => onChange({ ...filters, minRating: filters.minRating == r ? '' : r })}
              />
              <span>{'★'.repeat(Math.floor(r))} {r}+</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
