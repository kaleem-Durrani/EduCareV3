import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Students service functions
 */
export const studentsService = {
  /**
   * Get all students with pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getStudents: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.STUDENTS.LIST, { params });
  },

  /**
   * Get student by ID
   * @param {string} id - Student ID
   * @returns {Promise} - API response
   */
  getStudentById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.STUDENTS.GET_BY_ID(id));
  },

  /**
   * Create new student
   * @param {Object} studentData - Student data
   * @returns {Promise} - API response
   */
  createStudent: async (studentData) => {
    return await apiClient.post(API_ENDPOINTS.STUDENTS.CREATE, studentData);
  },

  /**
   * Update student
   * @param {string} id - Student ID
   * @param {Object} studentData - Updated student data
   * @returns {Promise} - API response
   */
  updateStudent: async (id, studentData) => {
    return await apiClient.put(API_ENDPOINTS.STUDENTS.UPDATE(id), studentData);
  },

  /**
   * Delete student
   * @param {string} id - Student ID
   * @returns {Promise} - API response
   */
  deleteStudent: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.STUDENTS.DELETE(id));
  },

  /**
   * Search students
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} - API response
   */
  searchStudents: async (query, filters = {}) => {
    return await apiClient.get(API_ENDPOINTS.STUDENTS.SEARCH, {
      params: { q: query, ...filters },
    });
  },

  /**
   * Bulk import students
   * @param {FormData} formData - Form data with file
   * @returns {Promise} - API response
   */
  bulkImportStudents: async (formData) => {
    return await apiClient.upload(API_ENDPOINTS.STUDENTS.BULK_IMPORT, formData);
  },

  /**
   * Export students data
   * @param {Object} filters - Export filters
   * @returns {Promise} - API response with file
   */
  exportStudents: async (filters = {}) => {
    return await apiClient.download(API_ENDPOINTS.STUDENTS.EXPORT, {
      params: filters,
    });
  },
};
