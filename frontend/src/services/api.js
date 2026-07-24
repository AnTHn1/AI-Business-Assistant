import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('DEBUG - Token en localStorage:', token ? 'Existe' : 'No existe');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('DEBUG - Header Authorization:', config.headers.Authorization.substring(0, 30) + '...');
  }
  return config;
});

export const authAPI = {
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const whatsappAPI = {
  getConversations: () => api.get('/whatsapp/conversations'),
  getMessages: (conversationId) => api.get(`/whatsapp/conversations/${conversationId}/messages`),
};

export default api;