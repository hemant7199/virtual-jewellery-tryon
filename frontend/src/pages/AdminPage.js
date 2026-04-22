import React, { useState, useEffect } from 'react';
import { jewelleryAPI } from '../utils/api';
import { MOCK_JEWELLERY, formatPrice } from '../utils/mockData';
import './AdminPage.css';

const EMPTY_FORM = {
  name:'', category:'earring', subcategory:'', material:'gold',
  price:'', currency:'INR', description:'', style:'contemporary',
  occasion:[], colorTone:'warm', gemstones:'', tags:'',
  arConfig: { scale:1, offsetX:0, offsetY:0, offsetZ:0, anchorLandmark:'' },
  inStock: true
};

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await jewelleryAPI.getAll({ limit: 100 });
      const data = res.data.data;
      setItems(data);
      computeStats(data);
    } catch {
      setItems(MOCK_JEWELLERY);
      computeStats(MOCK_JEWELLERY);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (data) => {
    const cats = {};
    data.forEach(j => { cats[j.category] = (cats[j.category]||0) + 1; });
    setStats({
      total: data.length,
      inStock: data.filter(j=>j.inStock).length,
      categories: cats,
      avgPrice: Math.round(data.reduce((s,j)=>s+j.price,0)/data.length)
    });
  };

  const handleEdit = (item) => {
    setForm({
      ...item,
      gemstones: item.gemstones?.join(', ') || '',
      tags: item.tags?.join(', ') || '',
      occasion: item.occasion || []
    });
    setEditId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await jewelleryAPI.delete(id);
      setItems(prev => prev.filter(j => j._id !== id));
    } catch {
      setItems(prev => prev.filter(j => j._id !== id)); // optimistic for demo
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      gemstones: form.gemstones ? form.gemstones.split(',').map(s=>s.trim()) : [],
      tags: form.tags ? form.tags.split(',').map(s=>s.trim()) : [],
      price: Number(form.price)
    };
    try {
      if (editId) {
        await jewelleryAPI.update(editId, payload);
        setItems(prev => prev.map(j => j._id === editId ? { ...j, ...payload } : j));
      } else {
        const res = await jewelleryAPI.create(payload);
        setItems(prev => [res.data.data, ...prev]);
      }
    } catch {
      // Optimistic update for demo
      if (editId) {
        setItems(prev => prev.map(j => j._id === editId ? { ...j, ...payload } : j));
      } else {
        setItems(prev => [{ ...payload, _id: 'new_'+Date.now(), rating:4.5, reviewCount:0 }, ...prev]);
      }
    } finally {
      setSaving(false);
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    }
  };

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color:'var(--grey)', fontSize:13 }}>Manage the GLIMMR jewellery catalogue</p>
          </div>
          <button className="btn btn-gold" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(!showForm); }}>
            {showForm ? '✕ Cancel' : '+ Add Jewellery'}
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label:'Total Pieces', value: stats.total || 0, icon:'💎' },
            { label:'In Stock', value: stats.inStock || 0, icon:'✅' },
            { label:'Categories', value: Object.keys(stats.categories||{}).length, icon:'📂' },
            { label:'Avg. Price', value: stats.avgPrice ? `₹${stats.avgPrice.toLocaleString('en-IN')}` : '–', icon:'💰' }
          ].map(s => (
            <div key={s.label} className="admin-stat-card card">
              <span className="admin-stat-icon">{s.icon}</span>
              <div>
                <span className="admin-stat-value">{s.value}</span>
                <span className="admin-stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="admin-form card">
            <h3>{editId ? 'Edit Jewellery' : 'Add New Jewellery'}</h3>
            <form onSubmit={handleSave} className="admin-form-grid">
              <div className="form-group">
                <label className="input-label">Name *</label>
                <input className="input" required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Royal Kundan Jhumka" />
              </div>
              <div className="form-group">
                <label className="input-label">Category *</label>
                <select className="input" value={form.category} onChange={e=>set('category',e.target.value)}>
                  {['earring','necklace','ring','bracelet','nose-ring','bangle','pendant'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Material *</label>
                <select className="input" value={form.material} onChange={e=>set('material',e.target.value)}>
                  {['gold','silver','diamond','rose-gold','white-gold','platinum','pearl','gemstone'].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Price (₹) *</label>
                <input className="input" type="number" required value={form.price} onChange={e=>set('price',e.target.value)} placeholder="e.g. 18500" />
              </div>
              <div className="form-group">
                <label className="input-label">Style</label>
                <select className="input" value={form.style} onChange={e=>set('style',e.target.value)}>
                  {['traditional','contemporary','bridal','casual','minimalist','fusion'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">Color Tone</label>
                <select className="input" value={form.colorTone} onChange={e=>set('colorTone',e.target.value)}>
                  {['warm','cool','neutral'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group form-full">
                <label className="input-label">Description</label>
                <textarea className="input" rows={3} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Brief description of the jewellery piece…" style={{ resize:'vertical' }}/>
              </div>
              <div className="form-group">
                <label className="input-label">Gemstones (comma separated)</label>
                <input className="input" value={form.gemstones} onChange={e=>set('gemstones',e.target.value)} placeholder="e.g. diamond, ruby, emerald" />
              </div>
              <div className="form-group">
                <label className="input-label">Tags (comma separated)</label>
                <input className="input" value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="e.g. bridal, gifting, traditional" />
              </div>
              <div className="form-group">
                <label className="input-label">AR Anchor Landmark</label>
                <select className="input" value={form.arConfig?.anchorLandmark} onChange={e=>set('arConfig',{...form.arConfig,anchorLandmark:e.target.value})}>
                  {['left_ear','right_ear','neck_center','left_nostril','ring_finger_right','left_wrist'].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="input-label">AR Scale</label>
                <input className="input" type="number" step="0.1" min="0.1" max="3" value={form.arConfig?.scale} onChange={e=>set('arConfig',{...form.arConfig,scale:Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="input-label">In Stock</label>
                <div style={{ display:'flex', gap:12, paddingTop:8 }}>
                  {[true,false].map(v=>(
                    <label key={v} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:13, color:'var(--ivory-dim)' }}>
                      <input type="radio" checked={form.inStock===v} onChange={()=>set('inStock',v)} />
                      {v ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-full form-actions">
                <button type="submit" className="btn btn-gold" disabled={saving}>
                  {saving ? 'Saving…' : editId ? 'Update Jewellery' : 'Add Jewellery'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="admin-table-wrap card">
          <div className="admin-table-header">
            <h3>Jewellery Catalogue ({items.length})</h3>
          </div>
          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Category</th><th>Material</th>
                    <th>Style</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td className="td-name">{item.name}</td>
                      <td><span className="badge badge-dark">{item.category}</span></td>
                      <td>{item.material}</td>
                      <td>{item.style}</td>
                      <td className="td-price">{formatPrice(item.price, item.currency)}</td>
                      <td>
                        <span className={`stock-dot ${item.inStock ? 'in' : 'out'}`}></span>
                        {item.inStock ? 'In Stock' : 'Out'}
                      </td>
                      <td>⭐ {item.rating}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn edit" onClick={() => handleEdit(item)}>Edit</button>
                          <button className="action-btn delete" onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
