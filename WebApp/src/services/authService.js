import { api } from './api.js';

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  verifyToken: () => api.get('/verify-token'),
  updateProfile: (profileData) => api.put('/update-profile', profileData),
};
