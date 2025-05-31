import { api } from './api.js';

export const parentService = {
  getAllParents: () => api.get('/parents/all'),
  createStudentParentRelation: (relationData) => api.post('/student-parent', relationData),
};
