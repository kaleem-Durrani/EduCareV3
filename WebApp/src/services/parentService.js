import { api } from "./api.js";

export const parentService = {
  // Statistics
  getParentsStatistics: () => api.get("/parents/statistics"),

  // Parent CRUD
  getAllParents: (params) => api.get("/parents", { params }),
  getParentsForSelect: () => api.get("/parents/select"),
  getParentById: (parentId) => api.get(`/parents/${parentId}`),
  createParent: (formData) =>
    api.post("/parents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateParent: (parentId, formData) =>
    api.put(`/parents/${parentId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteParent: (parentId) => api.delete(`/parents/${parentId}`),

  // Parent-Student Relationships
  createStudentParentRelation: (relationData) =>
    api.post("/student-parent", relationData),
  getParentChildren: (parentId, params) =>
    api.get(`/parents/${parentId}/children`, { params }),
  updateParentStudentRelation: (relationId, data) =>
    api.put(`/parent-student-relations/${relationId}`, data),
  deleteParentStudentRelation: (relationId) =>
    api.delete(`/parent-student-relations/${relationId}`),
};
