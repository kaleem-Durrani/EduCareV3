import { apiClient } from "./api";
import { API_ENDPOINTS } from "../constants/api";

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
   * @param {string} id - Student ID (rollNum)
   * @param {Object} studentData - Updated student data
   * @returns {Promise} - API response
   */
  updateStudent: async (id, studentData) => {
    return await apiClient.put(API_ENDPOINTS.STUDENTS.UPDATE(id), studentData);
  },

  /**
   * Enroll student in class
   * @param {string} id - Student ID
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise} - API response
   */
  enrollStudent: async (id, enrollmentData) => {
    return await apiClient.post(
      API_ENDPOINTS.STUDENTS.ENROLL(id),
      enrollmentData
    );
  },

  /**
   * Transfer student to another class
   * @param {string} id - Student ID
   * @param {Object} transferData - Transfer data
   * @returns {Promise} - API response
   */
  transferStudent: async (id, transferData) => {
    return await apiClient.post(
      API_ENDPOINTS.STUDENTS.TRANSFER(id),
      transferData
    );
  },

  /**
   * Withdraw student
   * @param {string} id - Student ID
   * @param {Object} withdrawData - Withdrawal data
   * @returns {Promise} - API response
   */
  withdrawStudent: async (id, withdrawData) => {
    return await apiClient.post(
      API_ENDPOINTS.STUDENTS.WITHDRAW(id),
      withdrawData
    );
  },

  /**
   * Get student enrollment history
   * @param {string} id - Student ID
   * @returns {Promise} - API response
   */
  getEnrollmentHistory: async (id) => {
    return await apiClient.get(API_ENDPOINTS.STUDENTS.ENROLLMENT_HISTORY(id));
  },

  /**
   * Get basic student info for parent
   * @param {string} id - Student ID
   * @returns {Promise} - API response
   */
  getBasicInfoForParent: async (id) => {
    return await apiClient.get(API_ENDPOINTS.STUDENTS.BASIC_INFO_PARENT(id));
  },

  /**
   * Search students (CLIENT-SIDE IMPLEMENTATION)
   * Note: Backend doesn't have search endpoint, implementing client-side search
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} - API response
   */
  searchStudents: async (query, filters = {}) => {
    // eslint-disable-line no-unused-vars
    try {
      // TODO: Implement search endpoint in backend
      // For now, get all students and filter client-side
      const response = await studentsService.getStudents();

      if (response.error) {
        return response;
      }

      const students = response.data || [];
      const filteredStudents = students.filter((student) => {
        const searchText = query.toLowerCase();
        return (
          student.fullName?.toLowerCase().includes(searchText) ||
          student.rollNum?.toString().includes(searchText) ||
          student.class?.toLowerCase().includes(searchText)
        );
      });

      return {
        data: filteredStudents,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Search functionality not available",
          code: "SEARCH_NOT_IMPLEMENTED",
        },
      };
    }
  },

  /**
   * Bulk import students
   * Note: Backend doesn't have bulk import endpoint
   * @param {FormData} formData - Form data with file
   * @returns {Promise} - API response
   */
  bulkImportStudents: async (formData) => {
    // eslint-disable-line no-unused-vars
    // TODO: Implement bulk import endpoint in backend
    return {
      data: null,
      error: {
        message: "Bulk import functionality not yet implemented",
        code: "BULK_IMPORT_NOT_IMPLEMENTED",
      },
    };
  },

  /**
   * Export students data
   * Note: Backend doesn't have export endpoint
   * @param {Object} filters - Export filters
   * @returns {Promise} - API response with file
   */
  exportStudents: async (filters = {}) => {
    // eslint-disable-line no-unused-vars
    // TODO: Implement export endpoint in backend
    return {
      data: null,
      error: {
        message: "Export functionality not yet implemented",
        code: "EXPORT_NOT_IMPLEMENTED",
      },
    };
  },

  /**
   * Delete student (soft delete)
   * Note: Backend doesn't have delete endpoint
   * @param {string} id - Student ID
   * @returns {Promise} - API response
   */
  deleteStudent: async (id) => {
    // eslint-disable-line no-unused-vars
    // TODO: Implement soft delete endpoint in backend
    return {
      data: null,
      error: {
        message: "Delete functionality not yet implemented",
        code: "DELETE_NOT_IMPLEMENTED",
      },
    };
  },
};
