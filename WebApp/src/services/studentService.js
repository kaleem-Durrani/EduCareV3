import { api } from "./api.js";

export const studentService = {
  getAllStudents: () => api.get("/students"),
  getStudentsForSelect: () => api.get("/students/select"),
  createStudent: (studentData) => api.post("/student", studentData),
  updateStudent: (studentId, studentData) =>
    api.put(`/student/${studentId}`, studentData),
  enrollStudent: (studentId, enrollmentData) =>
    api.post(`/student/${studentId}/enroll`, enrollmentData),
  getEnrollmentHistory: (studentId) =>
    api.get(`/student/${studentId}/enrollment-history`),
  transferStudent: (studentId, transferData) =>
    api.put(`/student/${studentId}/transfer`, transferData),
  withdrawStudent: (studentId, withdrawData) =>
    api.put(`/student/${studentId}/withdraw`, withdrawData),
  getBasicInfoForParent: (studentId) =>
    api.get(`/student/${studentId}/basic-info-parent`),
  getBasicInfoForTeacher: (studentId) =>
    api.get(`/student/${studentId}/basic-info-teacher`),
  getParentStudents: () => api.get("/students/parent"),
};
