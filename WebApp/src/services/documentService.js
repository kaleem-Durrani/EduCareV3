import { api } from "./api.js";

export const documentService = {
  getDocumentTypes: () => api.get("/documents/types"),
  getPaginatedDocumentTypes: (page = 1, limit = 10) =>
    api.get(`/documents/types/paginated?page=${page}&limit=${limit}`),
  createDocumentType: (typeData) => api.post("/documents/types", typeData),
  updateDocumentType: (typeId, typeData) =>
    api.put(`/documents/types/${typeId}`, typeData),
  deleteDocumentType: (typeId) => api.delete(`/documents/types/${typeId}`),
  getStudentDocuments: (studentId) =>
    api.get(`/documents/student/${studentId}`),
  updateStudentDocuments: (studentId, documentsData) =>
    api.put(`/documents/student/${studentId}`, documentsData),

  // EFFICIENT ENDPOINTS
  getAllStudentsDocuments: () => api.get("/documents/students/all"),
  getDocumentStatistics: () => api.get("/documents/statistics"),
  getPaginatedStudentsDocuments: (page = 1, limit = 10) =>
    api.get(`/documents/students/paginated?page=${page}&limit=${limit}`),
};
