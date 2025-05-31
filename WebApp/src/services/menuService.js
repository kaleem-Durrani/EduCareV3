import { api } from './api.js';

export const menuService = {
  getCurrentWeeklyMenu: () => api.get('/menu/weekly'),
  createWeeklyMenu: (menuData) => api.post('/menu/weekly', menuData),
  updateWeeklyMenu: (menuId, menuData) => api.put(`/menu/weekly/${menuId}`, menuData),
  deleteWeeklyMenu: (menuId) => api.delete(`/menu/weekly/${menuId}`),
};
