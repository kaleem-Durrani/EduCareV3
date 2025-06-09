import { api } from "./api.js";

export const studentService = {
  getStudentStatistics: (params = {}) =>
    api.get("/students/statistics", { params }),
  generateEnrollmentNumber: () =>
    api.get("/students/generate-enrollment-number"),
  getAllStudents: (params = {}) => api.get("/students", { params }),
  getStudentById: (studentId) => api.get(`/students/${studentId}`),
  getStudentsForSelect: () => api.get("/students/select"),
  getStudentDetails: (studentId, params = {}) =>
    api.get(`/students/${studentId}/details`, { params }),
  createStudent: (studentData) => api.post("/student", studentData),
  updateStudent: (studentId, studentData) =>
    api.put(`/students/${studentId}`, studentData),
  updateStudentPhoto: (studentId, formData) =>
    api.put(`/students/${studentId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStudentActiveStatus: (studentId, statusData) =>
    api.put(`/students/${studentId}/active`, statusData),
  addStudentContact: (studentId, contactData) =>
    api.post(`/students/${studentId}/contacts`, contactData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStudentContact: (studentId, contactId, contactData) =>
    api.put(`/students/${studentId}/contacts/${contactId}`, contactData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteStudentContact: (studentId, contactId) =>
    api.delete(`/students/${studentId}/contacts/${contactId}`),
  getEnrollmentHistory: (studentId) =>
    api.get(`/students/${studentId}/enrollment-history`),
  transferStudent: (studentId, transferData) =>
    api.post(`/students/${studentId}/transfer`, transferData),
  withdrawStudent: (studentId, withdrawData) =>
    api.post(`/students/${studentId}/withdraw`, withdrawData),
  getBasicInfoForParent: (studentId) =>
    api.get(`/student/${studentId}/basic-info`),
  getBasicInfoForTeacher: (studentId) =>
    api.get(`/student/${studentId}/basic-info-for-teacher`),
  getParentStudents: () => api.get("/parent/students"),
};
