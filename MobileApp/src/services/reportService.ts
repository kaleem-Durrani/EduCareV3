import { ApiService } from './api';
import { ApiResponse } from '../types';

// Report types for mobile app
export interface DailyReport {
  day: string;
  toilet: string;
  food_intake: string;
  friends_interaction: string;
  studies_mood: string;
}

export interface WeeklyReport {
  _id: string;
  student_id: {
    _id: string;
    fullName: string;
    rollNum: number;
  };
  weekStart: string;
  weekEnd: string;
  dailyReports: DailyReport[];
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

export interface WeeklyReportsResponse {
  reports: WeeklyReport[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateWeeklyReportData {
  student_id: string;
  weekStart: string;
  weekEnd: string;
  dailyReports: DailyReport[];
}

export interface UpdateWeeklyReportData {
  dailyReports: DailyReport[];
}

/**
 * Report service for handling all report-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const reportService = {
  /**
   * Get weekly reports for a student (mobile app)
   * Uses existing endpoint: GET /api/reports/weekly/:student_id
   */
  getWeeklyReports: async (
    studentId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<WeeklyReportsResponse>> => {
    const params: Record<string, string | number> = {
      page,
      limit,
    };
    
    if (startDate) params.weekStart = startDate;
    if (endDate) params.weekEnd = endDate;

    return ApiService.get<WeeklyReportsResponse>(`/reports/weekly/${studentId}`, { params });
  },

  /**
   * Create weekly report (mobile app)
   * Uses existing endpoint: POST /api/reports/weekly
   */
  createWeeklyReport: async (reportData: CreateWeeklyReportData): Promise<ApiResponse<WeeklyReport>> => {
    return ApiService.post<WeeklyReport>('/reports/weekly', reportData);
  },

  /**
   * Update weekly report (mobile app)
   * Uses existing endpoint: PUT /api/reports/weekly/:report_id
   */
  updateWeeklyReport: async (
    reportId: string,
    reportData: UpdateWeeklyReportData
  ): Promise<ApiResponse<WeeklyReport>> => {
    return ApiService.put<WeeklyReport>(`/reports/weekly/${reportId}`, reportData);
  },

  /**
   * Delete weekly report (mobile app)
   * Uses existing endpoint: DELETE /api/reports/weekly/:report_id
   */
  deleteWeeklyReport: async (reportId: string): Promise<ApiResponse<void>> => {
    return ApiService.delete<void>(`/reports/weekly/${reportId}`);
  },
};
