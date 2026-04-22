import { useState, useEffect, useCallback, useRef } from 'react';
import { jewelleryAPI } from '../utils/api';
import { MOCK_JEWELLERY } from '../utils/mockData';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function setCached(key, data) {
  cache.set(key, { data, time: Date.now() });
}

// ── useJewelleryList ─────────────────────────────────────────────────
export function useJewelleryList(filters = {}) {
  const [items, setItems]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const filtersKey = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cacheKey = `list:${filtersKey}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setItems(cached.data);
      setTotal(cached.total);
      setLoading(false);
      return;
    }

    try {
      const res = await jewelleryAPI.getAll(filters);
      const { data, total } = res.data;
      setItems(data);
      setTotal(total);
      setCached(cacheKey, { data, total });
    } catch (err) {
      // Fallback to mock data
      let mock = [...MOCK_JEWELLERY];
      if (filters.category) mock = mock.filter(j => j.category === filters.category);
      if (filters.material) mock = mock.filter(j => j.material === filters.material);
      if (filters.style)    mock = mock.filter(j => j.style === filters.style);
      setItems(mock);
      setTotal(mock.length);
      setError('Using offline data');
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => { load(); }, [load]);

  return { items, total, loading, error, reload: load };
}

// ── useJewelleryItem ─────────────────────────────────────────────────
export function useJewelleryItem(id) {
  const [item, setItem]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const cacheKey = `item:${id}`;
      const cached = getCached(cacheKey);
      if (cached) { setItem(cached); setLoading(false); return; }

      try {
        const res = await jewelleryAPI.getById(id);
        if (!cancelled) {
          setItem(res.data.data);
          setCached(cacheKey, res.data.data);
        }
      } catch {
        const mock = MOCK_JEWELLERY.find(j => j._id === id);
        if (!cancelled) {
          setItem(mock || null);
          if (!mock) setError('Item not found');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  return { item, loading, error };
}

// ── useCategories ────────────────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const cached = getCached('categories');
      if (cached) { setCategories(cached); setLoading(false); return; }
      try {
        const res = await jewelleryAPI.getCategories();
        setCategories(res.data.data);
        setCached('categories', res.data.data);
      } catch {
        const cats = [...new Set(MOCK_JEWELLERY.map(j => j.category))];
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { categories, loading };
}

// ── useFeatured ──────────────────────────────────────────────────────
export function useFeatured(limit = 4) {
  const { items, loading } = useJewelleryList({ limit, sort: 'rating' });
  return { featured: items, loading };
}

// ── useSearch ────────────────────────────────────────────────────────
export function useSearch() {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((q) => {
    setQuery(q);
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await jewelleryAPI.getAll({ search: q, limit: 8 });
        setResults(res.data.data);
      } catch {
        const lower = q.toLowerCase();
        const mock = MOCK_JEWELLERY.filter(j =>
          j.name.toLowerCase().includes(lower) ||
          j.tags?.some(t => t.includes(lower)) ||
          j.category.includes(lower) ||
          j.material.includes(lower)
        );
        setResults(mock);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, []);

  return { query, results, searching, search, clearSearch: () => { setQuery(''); setResults([]); } };
}
