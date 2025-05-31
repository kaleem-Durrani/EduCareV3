import { api } from './api.js';

export const adminService = {
  getNumbers: () => api.get('/numbers'),
};
