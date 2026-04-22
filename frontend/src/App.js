import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import TryOnPage from './pages/TryOnPage';
import ProductPage from './pages/ProductPage';
import RecommendPage from './pages/RecommendPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';

// ── Global App Context ──────────────────────────────────────────────
export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('glimmr_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('glimmr_token') || null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedJewellery, setSelectedJewellery] = useState(null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('glimmr_user', JSON.stringify(userData));
    localStorage.setItem('glimmr_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('glimmr_user');
    localStorage.removeItem('glimmr_token');
  };

  const toggleFavorite = (item) => {
    setFavorites(prev =>
      prev.find(f => f._id === item._id)
        ? prev.filter(f => f._id !== item._id)
        : [...prev, item]
    );
  };

  const addToCart = (item) => {
    setCart(prev =>
      prev.find(c => c._id === item._id)
        ? prev
        : [...prev, { ...item, qty: 1 }]
    );
  };

  const ctx = {
    user, token, login, logout,
    cart, setCart, addToCart,
    favorites, toggleFavorite,
    selectedJewellery, setSelectedJewellery
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="/catalogue"     element={<CataloguePage />} />
            <Route path="/catalogue/:id" element={<ProductPage />} />
            <Route path="/tryon"         element={<TryOnPage />} />
            <Route path="/tryon/:id"     element={<TryOnPage />} />
            <Route path="/recommend"     element={<RecommendPage />} />
            <Route path="/login"         element={user ? <Navigate to="/profile" /> : <LoginPage />} />
            <Route path="/profile"       element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/admin"         element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
            <Route path="/cart"          element={<CartPage />} />
            <Route path="*"              element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </AppContext.Provider>
  );
}
