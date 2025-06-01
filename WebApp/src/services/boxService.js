import { api } from "./api.js";

export const boxService = {
  getBoxItems: () => api.get("/box/items"),
  getPaginatedBoxItems: (page = 1, limit = 10) =>
    api.get(`/box/items/paginated?page=${page}&limit=${limit}`),
  getStudentBoxStatus: (studentId) => api.get(`/box/student/${studentId}`),
  updateStudentBoxStatus: (studentId, statusData) =>
    api.put(`/box/student/${studentId}`, statusData),

  // EFFICIENT ENDPOINTS
  getBoxStatistics: () => api.get("/box/statistics"),
  getPaginatedStudentsBoxStatus: (page = 1, limit = 10) =>
    api.get(`/box/students/paginated?page=${page}&limit=${limit}`),
};
