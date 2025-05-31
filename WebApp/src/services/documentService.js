import { api } from './api.js';

export const documentService = {
  getDocumentTypes: () => api.get('/documents/types'),
  createDocumentType: (typeData) => api.post('/documents/types', typeData),
  updateDocumentType: (typeId, typeData) => api.put(`/documents/types/${typeId}`, typeData),
  deleteDocumentType: (typeId) => api.delete(`/documents/types/${typeId}`),
  getStudentDocuments: (studentId) => api.get(`/documents/student/${studentId}`),
  updateStudentDocuments: (studentId, documentsData) => api.put(`/documents/student/${studentId}`, documentsData),
};
