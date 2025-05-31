import { api } from './api.js';

export const teacherService = {
  getAllTeachers: () => api.get('/teachers/all'),
  createTeacher: (teacherData) => api.post('/teacher/create', teacherData),
};
