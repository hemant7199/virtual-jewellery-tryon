import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('glimmr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('glimmr_token');
      localStorage.removeItem('glimmr_user');
    }
    return Promise.reject(err);
  }
);

// ── Jewellery API ────────────────────────────────────
export const jewelleryAPI = {
  getAll: (params = {}) => api.get('/jewellery', { params }),
  getById: (id) => api.get(`/jewellery/${id}`),
  getCategories: () => api.get('/jewellery/categories'),
  create: (data) => api.post('/jewellery', data),
  update: (id, data) => api.put(`/jewellery/${id}`, data),
  delete: (id) => api.delete(`/jewellery/${id}`)
};

// ── Auth API ─────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// ── Recommend API ────────────────────────────────────
export const recommendAPI = {
  jewellery: (jewelleryId, limit = 6) => api.post('/recommend/jewellery', { jewelleryId, limit }),
  outfit: (jewelleryId) => api.post('/recommend/outfit', { jewelleryId }),
  imageSearch: (data) => api.post('/recommend/image-search', data)
};

// ── Chatbot API ──────────────────────────────────────
export const chatbotAPI = {
  message: (message, conversationHistory = []) =>
    api.post('/chatbot/message', { message, conversationHistory }),
  getSuggestions: () => api.get('/chatbot/suggestions')
};

// ── TryOn API ────────────────────────────────────────
export const tryOnAPI = {
  startSession: (data) => api.post('/tryon/session/start', data),
  addItem: (sessionId, data) => api.post(`/tryon/session/${sessionId}/item`, data),
  submitFeedback: (sessionId, data) => api.post(`/tryon/session/${sessionId}/feedback`, data)
};

// ── User API ─────────────────────────────────────────
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  toggleFavorite: (jewelleryId) => api.post(`/users/favorites/${jewelleryId}`),
  getFavorites: () => api.get('/users/favorites')
};

export default api;
