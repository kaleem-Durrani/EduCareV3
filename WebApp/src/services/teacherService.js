import { api } from "./api.js";

export const teacherService = {
  getTeacherStatistics: (params = {}) =>
    api.get("/teachers/statistics", { params }),
  getAllTeachers: (params = {}) => api.get("/teachers/all", { params }),
  getTeacherById: (teacherId) => api.get(`/teachers/${teacherId}`),
  getTeachersForSelect: () => api.get("/teachers/select"),
  getTeacherDetails: (teacherId, params = {}) =>
    api.get(`/teachers/${teacherId}/details`, { params }),
  createTeacher: (teacherData) => api.post("/teacher/create", teacherData),
  updateTeacher: (teacherId, teacherData) =>
    api.put(`/teachers/${teacherId}`, teacherData),
  updateTeacherPhoto: (teacherId, formData) =>
    api.put(`/teachers/${teacherId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  enrollTeacher: (classId, teacherData) =>
    api.post(`/classes/${classId}/teacher`, teacherData),
  removeTeacherFromClass: (classId, teacherId) =>
    api.delete(`/classes/${classId}/teachers/${teacherId}`),
};
