import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Food Menu service functions
 */
export const menuService = {
  /**
   * Get current weekly menu
   * @returns {Promise} - API response
   */
  getCurrentWeeklyMenu: async () => {
    return await apiClient.get(API_ENDPOINTS.FOOD_MENU.GET_CURRENT);
  },

  /**
   * Create weekly menu
   * @param {Object} menuData - Menu data
   * @returns {Promise} - API response
   */
  createWeeklyMenu: async (menuData) => {
    return await apiClient.post(API_ENDPOINTS.FOOD_MENU.CREATE, menuData);
  },

  /**
   * Update weekly menu
   * @param {string} id - Menu ID
   * @param {Object} menuData - Updated menu data
   * @returns {Promise} - API response
   */
  updateWeeklyMenu: async (id, menuData) => {
    return await apiClient.put(API_ENDPOINTS.FOOD_MENU.UPDATE(id), menuData);
  },

  /**
   * Delete weekly menu
   * @param {string} id - Menu ID
   * @returns {Promise} - API response
   */
  deleteWeeklyMenu: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.FOOD_MENU.DELETE(id));
  },
};
