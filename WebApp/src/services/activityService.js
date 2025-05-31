import { api } from './api.js';

export const activityService = {
  getClassActivities: (classId, params = {}) => api.get(`/activities/class/${classId}`, { params }),
  getActivityById: (activityId) => api.get(`/activities/${activityId}`),
  createActivity: (activityData) => api.post('/activities', activityData),
  updateActivity: (activityId, activityData) => api.put(`/activities/${activityId}`, activityData),
  deleteActivity: (activityId) => api.delete(`/activities/${activityId}`),
};
