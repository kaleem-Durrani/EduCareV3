import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Classes service functions
 */
export const classesService = {
  /**
   * Create new class
   * @param {Object} classData - Class data
   * @returns {Promise} - API response
   */
  createClass: async (classData) => {
    return await apiClient.post(API_ENDPOINTS.CLASSES.CREATE, classData);
  },

  /**
   * Update class
   * @param {string} id - Class ID
   * @param {Object} classData - Updated class data
   * @returns {Promise} - API response
   */
  updateClass: async (id, classData) => {
    return await apiClient.put(API_ENDPOINTS.CLASSES.UPDATE(id), classData);
  },

  /**
   * Add teacher to class
   * @param {string} classId - Class ID
   * @param {Object} teacherData - Teacher data
   * @returns {Promise} - API response
   */
  addTeacherToClass: async (classId, teacherData) => {
    return await apiClient.post(API_ENDPOINTS.CLASSES.ADD_TEACHER(classId), teacherData);
  },

  /**
   * Remove teacher from class
   * @param {string} classId - Class ID
   * @param {Object} teacherData - Teacher data
   * @returns {Promise} - API response
   */
  removeTeacherFromClass: async (classId, teacherData) => {
    return await apiClient.post(API_ENDPOINTS.CLASSES.REMOVE_TEACHER(classId), teacherData);
  },

  /**
   * Add student to class
   * @param {string} classId - Class ID
   * @param {Object} studentData - Student data
   * @returns {Promise} - API response
   */
  addStudentToClass: async (classId, studentData) => {
    return await apiClient.post(API_ENDPOINTS.CLASSES.ADD_STUDENT(classId), studentData);
  },

  /**
   * Remove student from class
   * @param {string} classId - Class ID
   * @param {Object} studentData - Student data
   * @returns {Promise} - API response
   */
  removeStudentFromClass: async (classId, studentData) => {
    return await apiClient.post(API_ENDPOINTS.CLASSES.REMOVE_STUDENT(classId), studentData);
  },

  /**
   * Get students in class
   * @param {string} classId - Class ID
   * @returns {Promise} - API response
   */
  getClassStudents: async (classId) => {
    return await apiClient.get(API_ENDPOINTS.CLASSES.GET_STUDENTS(classId));
  },

  /**
   * Get teachers in class
   * @param {string} classId - Class ID
   * @returns {Promise} - API response
   */
  getClassTeachers: async (classId) => {
    return await apiClient.get(API_ENDPOINTS.CLASSES.GET_TEACHERS(classId));
  },
};
