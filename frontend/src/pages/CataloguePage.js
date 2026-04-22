import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import JewelleryCard from '../components/JewelleryCard';
import { jewelleryAPI } from '../utils/api';
import { MOCK_JEWELLERY, MOCK_CATEGORIES, formatPrice } from '../utils/mockData';
import './CataloguePage.css';

const MATERIALS = ['gold', 'silver', 'diamond', 'rose-gold', 'white-gold', 'platinum', 'pearl'];
const STYLES = ['traditional', 'contemporary', 'bridal', 'casual', 'minimalist', 'fusion'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    material: searchParams.get('material') || '',
    style: searchParams.get('style') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  });
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.category) params.category = filters.category;
      if (filters.material) params.material = filters.material;
      if (filters.style) params.style = filters.style;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (search) params.search = search;

      const res = await jewelleryAPI.getAll(params);
      let data = res.data.data;

      // Client-side sort
      if (filters.sort === 'price_asc') data.sort((a,b) => a.price - b.price);
      if (filters.sort === 'price_desc') data.sort((a,b) => b.price - a.price);
      if (filters.sort === 'rating') data.sort((a,b) => b.rating - a.rating);

      setItems(data);
      setTotal(res.data.total);
    } catch {
      let data = [...MOCK_JEWELLERY];
      if (filters.category) data = data.filter(j => j.category === filters.category);
      if (filters.material) data = data.filter(j => j.material === filters.material);
      if (filters.style) data = data.filter(j => j.style === filters.style);
      if (search) data = data.filter(j => j.name.toLowerCase().includes(search.toLowerCase()) || j.tags.some(t => t.includes(search.toLowerCase())));
      if (filters.sort === 'price_asc') data.sort((a,b) => a.price - b.price);
      if (filters.sort === 'price_desc') data.sort((a,b) => b.price - a.price);
      if (filters.sort === 'rating') data.sort((a,b) => b.rating - a.rating);
      setItems(data);
      setTotal(data.length);
    } finally {
      setLoading(false);
    }
  }, [filters, search, page]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const setFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', material: '', style: '', sort: 'newest', minPrice: '', maxPrice: '' });
    setSearch('');
    setPage(1);
  };

  const activeFilterCount = [filters.category, filters.material, filters.style, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <div className="catalogue-page">
      {/* Page Header */}
      <div className="catalogue-hero">
        <div className="container">
          <span className="section-tag">Our Collection</span>
          <h1>Every Piece, <em>Perfectly Yours</em></h1>
          <div className="gold-line-center"></div>
          <p>Browse {total || MOCK_JEWELLERY.length}+ pieces. Try any in AR before you buy.</p>
        </div>
      </div>

      <div className="container catalogue-body">
        {/* Toolbar */}
        <div className="catalogue-toolbar">
          <div className="search-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search jewellery…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="toolbar-right">
            <span className="results-count">{total} results</span>
            <select
              className="sort-select"
              value={filters.sort}
              onChange={e => setFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              className={`btn btn-ghost btn-sm filters-toggle ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {filtersOpen && (
          <div className="filter-bar">
            <div className="filter-group">
              <span className="filter-label">Category</span>
              <div className="filter-chips">
                {MOCK_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                    onClick={() => setFilter('category', cat)}
                  >{cat}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Material</span>
              <div className="filter-chips">
                {MATERIALS.map(m => (
                  <button
                    key={m}
                    className={`filter-chip ${filters.material === m ? 'active' : ''}`}
                    onClick={() => setFilter('material', m)}
                  >{m}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Style</span>
              <div className="filter-chips">
                {STYLES.map(s => (
                  <button
                    key={s}
                    className={`filter-chip ${filters.style === s ? 'active' : ''}`}
                    onClick={() => setFilter('style', s)}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div className="filter-group filter-price">
              <span className="filter-label">Price Range (₹)</span>
              <div className="price-inputs">
                <input className="input" placeholder="Min" type="number" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
                <span>–</span>
                <input className="input" placeholder="Max" type="number" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="jewellery-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="card" style={{ height: 380 }}>
                <div className="skeleton" style={{ height: 240 }}></div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 12, width: '50%' }}></div>
                  <div className="skeleton" style={{ height: 20, width: '80%' }}></div>
                  <div className="skeleton" style={{ height: 14, width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: '3rem' }}>💎</span>
            <h3>No pieces found</h3>
            <p>Try adjusting your filters or search query.</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="jewellery-grid">
            {items.map(item => <JewelleryCard key={item._id} item={item} />)}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="pagination">
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="page-info">Page {page} of {Math.ceil(total / 12)}</span>
            <button className="btn btn-ghost btn-sm" disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
