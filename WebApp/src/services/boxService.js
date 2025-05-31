import { api } from './api.js';

export const boxService = {
  getBoxItems: () => api.get('/box/items'),
  getStudentBoxStatus: (studentId) => api.get(`/box/student/${studentId}`),
  updateStudentBoxStatus: (studentId, statusData) => api.put(`/box/student/${studentId}`, statusData),
};
