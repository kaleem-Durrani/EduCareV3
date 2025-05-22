import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Teachers service functions
 */
export const teachersService = {
  /**
   * Get all teachers
   * @returns {Promise} - API response
   */
  getTeachers: async () => {
    return await apiClient.get(API_ENDPOINTS.TEACHERS.LIST);
  },

  /**
   * Create new teacher
   * @param {Object} teacherData - Teacher data
   * @returns {Promise} - API response
   */
  createTeacher: async (teacherData) => {
    return await apiClient.post(API_ENDPOINTS.TEACHERS.CREATE, teacherData);
  },
};
