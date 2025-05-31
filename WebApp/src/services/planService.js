import { api } from './api.js';

export const planService = {
  getMonthlyPlan: (classId, params = {}) => api.get(`/plans/monthly/${classId}`, { params }),
  createMonthlyPlan: (planData) => api.post('/plans/monthly', planData),
  updateMonthlyPlan: (planId, planData) => api.put(`/plans/monthly/${planId}`, planData),
  deleteMonthlyPlan: (planId) => api.delete(`/plans/monthly/${planId}`),
  listMonthlyPlans: (classId) => api.get(`/plans/monthly/${classId}/list`),
};
