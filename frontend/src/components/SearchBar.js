import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../utils/useJewellery';
import { formatPrice } from '../utils/mockData';
import './SearchBar.css';

export default function SearchBar({ placeholder = 'Search jewellery…', onClose }) {
  const navigate = useNavigate();
  const { query, results, searching, search, clearSearch } = useSearch();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (item) => {
    clearSearch();
    setFocused(false);
    onClose?.();
    navigate(`/catalogue/${item._id}`, { state: { jewellery: item } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { clearSearch(); setFocused(false); onClose?.(); }
    if (e.key === 'Enter' && query) {
      navigate(`/catalogue?search=${encodeURIComponent(query)}`);
      setFocused(false);
      onClose?.();
    }
  };

  const showDropdown = focused && (results.length > 0 || (searching && query));

  return (
    <div className="search-bar-wrap" ref={containerRef}>
      <div className={`search-bar-inner ${focused ? 'focused' : ''}`}>
        <svg className="sb-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="sb-input"
          placeholder={placeholder}
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {query && (
          <button className="sb-clear" onClick={() => { clearSearch(); inputRef.current?.focus(); }}>✕</button>
        )}
        {searching && <div className="spinner" style={{ width: 16, height: 16, flexShrink: 0 }}></div>}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="sb-dropdown">
          {searching && results.length === 0 && (
            <div className="sb-searching">Searching…</div>
          )}
          {results.map(item => (
            <div key={item._id} className="sb-result" onClick={() => handleSelect(item)}>
              <span className="sb-result-icon">
                {item.category === 'earring' ? '💎' :
                 item.category === 'necklace' ? '📿' :
                 item.category === 'ring' ? '💍' :
                 item.category === 'bracelet' ? '🔮' :
                 item.category === 'nose-ring' ? '✦' : '🌟'}
              </span>
              <div className="sb-result-info">
                <span className="sb-result-name">{item.name}</span>
                <span className="sb-result-meta">{item.category} · {item.material}</span>
              </div>
              <span className="sb-result-price">{formatPrice(item.price, item.currency)}</span>
            </div>
          ))}
          {results.length > 0 && (
            <div
              className="sb-view-all"
              onClick={() => { navigate(`/catalogue?search=${encodeURIComponent(query)}`); setFocused(false); onClose?.(); }}
            >
              View all results for "{query}" →
            </div>
          )}
        </div>
      )}
    </div>
  );
}
