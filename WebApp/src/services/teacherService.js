import { api } from "./api.js";

export const teacherService = {
  getAllTeachers: () => api.get("/teachers/all"),
  getTeachersForSelect: () => api.get("/teachers/select"),
  createTeacher: (teacherData) => api.post("/teacher/create", teacherData),
};
