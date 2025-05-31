import { api } from './api.js';

export const healthService = {
  getHealthMetrics: (studentId, params = {}) => api.get(`/health/metrics/${studentId}`, { params }),
  createHealthMetric: (studentId, metricData) => api.post(`/health/metrics/${studentId}`, metricData),
  updateHealthMetric: (studentId, metricId, metricData) => api.put(`/health/metrics/${studentId}/${metricId}`, metricData),
  getHealthInfo: (studentId) => api.get(`/health/info/${studentId}`),
  updateHealthInfo: (studentId, healthData) => api.put(`/health/info/${studentId}`, healthData),
};
