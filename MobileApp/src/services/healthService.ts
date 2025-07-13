import { ApiService } from './api';
import { ApiResponse } from '../types';

// Health types for mobile app
export interface HealthMetricRecordedBy {
  _id: string;
  name: string;
  email: string;
}

export interface HealthMetric {
  _id: string;
  student_id: string;
  type: 'height' | 'weight';
  value: number;
  label?: string;
  notes?: string;
  date: string;
  recordedBy: HealthMetricRecordedBy;
  updatedBy?: HealthMetricRecordedBy;
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetricFilters {
  page?: number;
  limit?: number;
  type?: 'height' | 'weight';
  period?: 'week' | 'month' | '3months' | '6months' | 'year';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'type' | 'value';
  sortOrder?: 'asc' | 'desc';
}

export interface HealthMetricPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface HealthMetricChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color: string;
    strokeWidth: number;
  }>;
}

export interface HealthMetricsResponse {
  metrics: HealthMetric[];
  pagination: HealthMetricPagination;
  student: {
    _id: string;
    fullName: string;
    rollNum: string;
  };
  chartData?: HealthMetricChartData;
}

export interface HealthInfoUpdatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface HealthInfo {
  id: string;
  student_id: {
    _id: string;
    fullName: string;
    rollNum: string;
  };
  blood_group: string;
  allergy: string;
  eye_condition: string;
  heart_rate: string;
  ear_condition: string;
  updatedBy?: HealthInfoUpdatedBy;
  updatedAt: string;
}

export interface HealthStatistics {
  totalStudents: number;
  studentsWithHealthInfo: number;
  studentsWithMetrics: number;
  totalMetrics: number;
  recentMetrics: number;
  healthInfoCoverage: string;
  metricsCoverage: string;
}

/**
 * Health service for handling all health-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const healthService = {
  /**
   * Get health metrics for a student with pagination and filters (mobile app)
   * Uses existing endpoint: GET /api/health/metrics/:student_id
   */
  getHealthMetrics: async (
    studentId: string,
    filters?: HealthMetricFilters
  ): Promise<ApiResponse<HealthMetricsResponse>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.period) params.append('period', filters.period);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = queryString
      ? `/health/metrics/${studentId}?${queryString}`
      : `/health/metrics/${studentId}`;

    return ApiService.get<HealthMetricsResponse>(url);
  },

  /**
   * Get health info for a student (mobile app)
   * Uses existing endpoint: GET /api/health/info/:student_id
   */
  getHealthInfo: async (studentId: string): Promise<ApiResponse<HealthInfo>> => {
    return ApiService.get<HealthInfo>(`/health/info/${studentId}`);
  },

  /**
   * Get health statistics (mobile app)
   * Uses existing endpoint: GET /api/health/statistics
   */
  getHealthStatistics: async (): Promise<ApiResponse<HealthStatistics>> => {
    return ApiService.get<HealthStatistics>('/health/statistics');
  },
};