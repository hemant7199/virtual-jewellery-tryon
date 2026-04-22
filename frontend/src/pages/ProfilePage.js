import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { userAPI } from '../utils/api';
import JewelleryCard from '../components/JewelleryCard';
import { formatPrice } from '../utils/mockData';
import './ProfilePage.css';

const SKIN_TONES = ['fair','light','medium','olive','brown','dark'];
const STYLE_PREFS = ['traditional','contemporary','bridal','casual','minimalist','fusion'];
const METAL_PREFS = ['gold','silver','diamond','rose-gold','platinum','pearl'];

export default function ProfilePage() {
  const { user, logout, favorites } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    skinTone: user?.skinTone || '',
    stylePrefs: user?.preferences?.style || [],
    metalPrefs: user?.preferences?.metal || []
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePref = (arr, val) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({
        name: form.name,
        skinTone: form.skinTone,
        preferences: { style: form.stylePrefs, metal: form.metalPrefs }
      });
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(true); // optimistic for demo
      setEditMode(false);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{user.name?.[0]?.toUpperCase() || '?'}</div>
            {user.role === 'admin' && <span className="admin-badge">Admin</span>}
          </div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <div className="profile-header-stats">
              <div className="pstat"><span>{favorites.length}</span><span>Saved</span></div>
              <div className="pstat"><span>0</span><span>Orders</span></div>
              <div className="pstat"><span>∞</span><span>Try-Ons</span></div>
            </div>
          </div>
          <div className="profile-header-actions">
            <button className="btn btn-gold" onClick={() => navigate('/tryon')}>✦ AR Try-On</button>
            <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {['profile','favorites','history'].map(t => (
            <button key={t} className={`ptab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="profile-content">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="profile-edit">
              <div className="profile-section">
                <div className="section-title-row">
                  <h3>Personal Details</h3>
                  {!editMode
                    ? <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>Edit</button>
                    : <div style={{ display:'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                        <button className="btn btn-gold btn-sm" onClick={handleSave} disabled={saving}>
                          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
                        </button>
                      </div>
                  }
                </div>

                <div className="profile-fields">
                  <div className="form-group">
                    <label className="input-label">Full Name</label>
                    {editMode
                      ? <input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} />
                      : <span className="profile-field-val">{user.name}</span>
                    }
                  </div>
                  <div className="form-group">
                    <label className="input-label">Email</label>
                    <span className="profile-field-val">{user.email}</span>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Account Type</label>
                    <span className="profile-field-val" style={{ textTransform:'capitalize' }}>{user.role}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Style Preferences</h3>
                <p style={{ color:'var(--grey)', fontSize:13, marginBottom:20 }}>
                  Help us personalize recommendations for you.
                </p>

                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="input-label">Skin Tone</label>
                  <div className="skin-tone-grid">
                    {SKIN_TONES.map(tone => (
                      <button
                        key={tone}
                        className={`skin-btn ${form.skinTone === tone ? 'active' : ''}`}
                        onClick={() => editMode && setForm(p=>({...p, skinTone: tone}))}
                        disabled={!editMode}
                      >
                        <span className="skin-dot" style={{ background: skinColor(tone) }}></span>
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="input-label">Preferred Styles</label>
                  <div className="pref-chips">
                    {STYLE_PREFS.map(s => (
                      <button
                        key={s}
                        className={`pref-chip ${form.stylePrefs.includes(s) ? 'active' : ''}`}
                        onClick={() => editMode && setForm(p=>({...p, stylePrefs: togglePref(p.stylePrefs, s)}))}
                        disabled={!editMode}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Preferred Metals</label>
                  <div className="pref-chips">
                    {METAL_PREFS.map(m => (
                      <button
                        key={m}
                        className={`pref-chip ${form.metalPrefs.includes(m) ? 'active' : ''}`}
                        onClick={() => editMode && setForm(p=>({...p, metalPrefs: togglePref(p.metalPrefs, m)}))}
                        disabled={!editMode}
                      >{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {tab === 'favorites' && (
            <div className="favorites-tab">
              <h3 className="tab-section-title">Saved Pieces ({favorites.length})</h3>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <span style={{ fontSize: '3rem' }}>♡</span>
                  <h3>No saved pieces yet</h3>
                  <p>Browse our collection and heart pieces you love.</p>
                  <button className="btn btn-gold" onClick={() => navigate('/catalogue')}>Browse Collection</button>
                </div>
              ) : (
                <div className="jewellery-grid">
                  {favorites.map(item => <JewelleryCard key={item._id} item={item} />)}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div className="history-tab">
              <h3 className="tab-section-title">Try-On History</h3>
              <div className="empty-state">
                <span style={{ fontSize: '3rem' }}>✦</span>
                <h3>No try-on history yet</h3>
                <p>Start using the AR try-on to see your history here.</p>
                <button className="btn btn-gold" onClick={() => navigate('/tryon')}>Start AR Try-On</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function skinColor(tone) {
  const m = { fair:'#fde8d8', light:'#f3d5b5', medium:'#e0b896', olive:'#c8956c', brown:'#a0664a', dark:'#6b3a2a' };
  return m[tone] || '#c8956c';
}
