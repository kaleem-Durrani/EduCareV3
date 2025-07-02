import { ApiService } from './api';
import { ApiResponse } from '../types';

// Menu types for mobile app
export interface MenuDayItem {
  day: string;
  items: string[];
}

export interface WeeklyMenu {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'archived';
  menuData: MenuDayItem[];
  totalItems: number;
  isActive: boolean;
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
 * Menu service for handling all menu-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const menuService = {
  /**
   * Get current week's menu or active menu (mobile app)
   * Uses existing endpoint: GET /api/menu/current
   */
  getCurrentWeeklyMenu: async (): Promise<ApiResponse<WeeklyMenu | null>> => {
    return ApiService.get<WeeklyMenu | null>('/menu/current');
  },
};
