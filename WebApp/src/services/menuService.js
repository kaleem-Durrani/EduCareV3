import { api } from "./api.js";

export const menuService = {
  // Statistics
  getMenuStatistics: (params = {}) => api.get("/menus/statistics", { params }),

  // Menu management
  getAllMenus: (params = {}) => api.get("/menus", { params }),
  getCurrentWeeklyMenu: () => api.get("/menu/current"),
  getMenuById: (menuId) => api.get(`/menus/${menuId}`),
  createWeeklyMenu: (menuData) => api.post("/menus", menuData),
  updateWeeklyMenu: (menuId, menuData) => api.put(`/menus/${menuId}`, menuData),
  updateMenuStatus: (menuId, statusData) =>
    api.put(`/menus/${menuId}/status`, statusData),
  deleteWeeklyMenu: (menuId) => api.delete(`/menus/${menuId}`),
};
