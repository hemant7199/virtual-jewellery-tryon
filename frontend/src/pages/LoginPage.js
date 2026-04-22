import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useApp } from '../App';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const res = mode === 'login'
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.register({ name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      // Try demo account
      const res = await authAPI.login({ email: 'demo@glimmr.in', password: 'demo123' });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch {
      // Simulate login if backend unavailable
      login({ id: 'demo', name: 'Demo User', email: 'demo@glimmr.in', role: 'user' }, 'demo_token');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-icon">✦</span>
          <span>GLIMMR</span>
        </div>

        <h2 className="login-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Sign in to access your AR try-on history and favorites.'
            : 'Join GLIMMR to save favorites and personalize your experience.'}
        </p>

        <div className="login-mode-toggle">
          <button className={`mode-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setErrors({}); setServerError(''); }}>Sign In</button>
          <button className={`mode-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setErrors({}); setServerError(''); }}>Create Account</button>
        </div>

        {serverError && (
          <div className="login-error">
            <span>⚠</span> {serverError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input
                className={`input ${errors.name ? 'input-error' : ''}`}
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input
              className={`input ${errors.email ? 'input-error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              className={`input ${errors.password ? 'input-error' : ''}`}
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="input-label">Confirm Password</label>
              <input
                className={`input ${errors.confirm ? 'input-error' : ''}`}
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
              />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>
          )}

          <button type="submit" className="btn btn-gold btn-lg login-submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18 }}></span>
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-divider"><span>or</span></div>

        <button className="btn btn-ghost btn-lg demo-btn" onClick={demoLogin} disabled={loading}>
          ✦ Continue as Demo User
        </button>

        <p className="login-footer-note">
          By continuing, you agree to our Terms of Service and Privacy Policy. Your camera data is processed locally and never stored.
        </p>
      </div>
    </div>
  );
}
