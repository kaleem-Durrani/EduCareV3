import { api } from "./api.js";

export const feeService = {
  getAllFees: (params = {}) => api.get("/fees/all", { params }),
  getFeeStatistics: (params = {}) => api.get("/fees/statistics", { params }),
  getStudentFees: (studentId, params = {}) =>
    api.get(`/fees/${studentId}`, { params }),
  createFee: (feeData) => api.post("/fees", feeData),
  updateFeeStatus: (feeId, status) =>
    api.put(`/fees/${feeId}/status`, { status }),
  deleteFee: (feeId) => api.delete(`/fees/${feeId}`),
  getFeeSummary: (studentId) => api.get(`/fees/summary/${studentId}`),
};
