import { api } from './api.js';

export const reportService = {
  getWeeklyReports: (studentId, params = {}) => api.get(`/reports/weekly/${studentId}`, { params }),
  createWeeklyReport: (reportData) => api.post('/reports/weekly', reportData),
  updateWeeklyReport: (reportId, reportData) => api.put(`/reports/weekly/${reportId}`, reportData),
  createBatchReports: (studentId, batchData) => api.post(`/reports/weekly/batch/${studentId}`, batchData),
};
