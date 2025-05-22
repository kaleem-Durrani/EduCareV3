import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Dashboard service functions
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} - API response with stats
   */
  getStats: async () => {
    return await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
  },

  /**
   * Get recent activities
   * @param {number} limit - Number of activities to fetch
   * @returns {Promise} - API response with recent activities
   */
  getRecentActivities: async (limit = 10) => {
    return await apiClient.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES, {
      params: { limit },
    });
  },

  /**
   * Get dashboard overview data
   * @returns {Promise} - API response with overview data
   */
  getOverview: async () => {
    const [statsResponse, activitiesResponse] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentActivities(5),
    ]);

    return {
      data: {
        stats: statsResponse.data,
        recentActivities: activitiesResponse.data,
      },
      error: statsResponse.error || activitiesResponse.error,
    };
  },
};
