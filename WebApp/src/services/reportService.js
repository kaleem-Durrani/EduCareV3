import { api } from './api.js';

export const reportService = {
  getWeeklyReports: (studentId, startDate, endDate, page = 1, limit = 10) => {
    const params = {};
    if (startDate) params.weekStart = startDate;
    if (endDate) params.weekEnd = endDate;
    params.page = page;
    params.limit = limit;
    return api.get(`/reports/weekly/${studentId}`, { params });
  },
  createWeeklyReport: (reportData) => api.post('/reports/weekly', reportData),
  updateWeeklyReport: (reportId, reportData) => api.put(`/reports/weekly/${reportId}`, reportData),
  deleteWeeklyReport: (reportId) => api.delete(`/reports/weekly/${reportId}`),
  createBatchReports: (studentId, batchData) => api.post(`/reports/weekly/batch/${studentId}`, batchData),
};
