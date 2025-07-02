import { ApiService } from './api';
import { ApiResponse } from '../types';

// Monthly Plan types for mobile app
export interface MonthlyPlan {
  _id: string;
  month: number;
  year: number;
  class_id: {
    _id: string;
    name: string;
  };
  description: string;
  imageUrl?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Monthly Plan service for handling all monthly plan-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const monthlyPlanService = {
  /**
   * Get monthly plan for a class (mobile app)
   * Uses existing endpoint: GET /api/plans/monthly/:class_id?month=X&year=Y
   */
  getMonthlyPlan: async (
    classId: string, 
    month: number, 
    year: number
  ): Promise<ApiResponse<MonthlyPlan>> => {
    return ApiService.get<MonthlyPlan>(`/plans/monthly/${classId}?month=${month}&year=${year}`);
  },
};
