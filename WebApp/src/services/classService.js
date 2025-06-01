import { api } from "./api.js";

export const classService = {
  getAllClasses: () => api.get("/classes"),
  getClassesForSelect: () => api.get("/classes/select"),
  getClassById: (classId) => api.get(`/classes/${classId}`),
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
