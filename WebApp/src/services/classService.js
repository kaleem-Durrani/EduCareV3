import { api } from "./api.js";

export const classService = {
  getClassStatistics: (params = {}) =>
    api.get("/classes/statistics", { params }),
  getAllClasses: (params = {}) => api.get("/classes", { params }),
  getClassesForSelect: () => api.get("/classes/select"),
  getClassById: (classId) => api.get(`/classes/${classId}`),
  getClassDetails: (classId) => api.get(`/classes/${classId}/details`),
  createClass: (classData) => api.post("/classes", classData),
  updateClass: (classId, classData) =>
    api.put(`/classes/${classId}`, classData),
  getClassRoster: (classId) => api.get(`/classes/${classId}/roster`),
  enrollTeacher: (classId, teacherData) =>
    api.post(`/classes/${classId}/teacher`, teacherData),
  removeTeacherFromClass: (classId, teacherId) =>
    api.delete(`/classes/${classId}/teachers/${teacherId}`),
  addStudentToClass: (classId, studentData) =>
    api.post(`/classes/${classId}/students`, studentData),
  removeStudentFromClass: (classId, studentId) =>
    api.delete(`/classes/${classId}/students/${studentId}`),
  getEnrolledTeacherClasses: () => api.get("/classes/enrolled-teacher"),
};
