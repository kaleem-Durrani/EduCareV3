import { api } from './api.js';

export const feeService = {
  getStudentFees: (studentId, params = {}) => api.get(`/fees/${studentId}`, { params }),
  createFee: (feeData) => api.post('/fees', feeData),
  updateFeeStatus: (feeId, statusData) => api.put(`/fees/${feeId}/status`, statusData),
  getFeeSummary: (studentId) => api.get(`/fees/summary/${studentId}`),
};
