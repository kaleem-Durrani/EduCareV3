import { ApiService } from './api';
import { ApiResponse } from '../types';

// Health types for mobile app
export interface HealthMetric {
  _id: string;
  student_id: string;
  type: 'height' | 'weight' | 'bmi' | 'temperature' | 'blood_pressure' | 'other';
  value: number;
  unit: string;
  notes?: string;
  recordedDate: string;
  recordedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface HealthInfo {
  _id: string;
  student_id: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodType?: string;
  doctorInfo?: {
    name: string;
    phone: string;
    clinic: string;
  };
  notes?: string;
  lastUpdated: string;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateHealthMetricData {
  student_id: string;
  type: 'height' | 'weight' | 'bmi' | 'temperature' | 'blood_pressure' | 'other';
  value: number;
  unit: string;
  notes?: string;
  recordedDate: string;
}

export interface UpdateHealthMetricData {
  type?: 'height' | 'weight' | 'bmi' | 'temperature' | 'blood_pressure' | 'other';
  value?: number;
  unit?: string;
  notes?: string;
  recordedDate?: string;
}

export interface UpdateHealthInfoData {
  allergies?: string[];
  medications?: string[];
  medicalConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodType?: string;
  doctorInfo?: {
    name: string;
    phone: string;
    clinic: string;
  };
  notes?: string;
}

export interface HealthMetricFilters {
  type?: 'height' | 'weight' | 'bmi' | 'temperature' | 'blood_pressure' | 'other';
  period?: 'week' | 'month' | 'year' | 'all';
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface HealthMetricsResponse {
  metrics: HealthMetric[];
  student: {
    _id: string;
    fullName: string;
    rollNum: number;
  };
  summary?: {
    latestHeight?: HealthMetric;
    latestWeight?: HealthMetric;
    latestBMI?: HealthMetric;
  };
}

/**
 * Health service for handling all health-related API calls in mobile app
 */
export const healthService = {
  /**
   * Get health metrics for a student (Parent access)
   * Uses endpoint: GET /api/health/metrics/:student_id
   */
  getHealthMetrics: async (
    studentId: string, 
    filters?: HealthMetricFilters
  ): Promise<ApiResponse<HealthMetricsResponse>> => {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.period) params.append('period', filters.period);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString 
      ? `/health/metrics/${studentId}?${queryString}` 
      : `/health/metrics/${studentId}`;

    return ApiService.get<HealthMetricsResponse>(url);
  },

  /**
   * Get health info for a student (Parent access)
   * Uses endpoint: GET /api/health/info/:student_id
   */
  getHealthInfo: async (studentId: string): Promise<ApiResponse<HealthInfo>> => {
    return ApiService.get<HealthInfo>(`/health/info/${studentId}`);
  },

  /**
   * Create health metric (Admin/Teacher only)
   * Uses endpoint: POST /api/health/metrics
   */
  createHealthMetric: async (metricData: CreateHealthMetricData): Promise<ApiResponse<HealthMetric>> => {
    return ApiService.post<HealthMetric>('/health/metrics', metricData);
  },

  /**
   * Update health metric (Admin/Teacher only)
   * Uses endpoint: PUT /api/health/metrics/:metric_id
   */
  updateHealthMetric: async (
    metricId: string, 
    metricData: UpdateHealthMetricData
  ): Promise<ApiResponse<HealthMetric>> => {
    return ApiService.put<HealthMetric>(`/health/metrics/${metricId}`, metricData);
  },

  /**
   * Delete health metric (Admin/Teacher only)
   * Uses endpoint: DELETE /api/health/metrics/:metric_id
   */
  deleteHealthMetric: async (metricId: string): Promise<ApiResponse<null>> => {
    return ApiService.delete<null>(`/health/metrics/${metricId}`);
  },

  /**
   * Update health info (Admin/Teacher only)
   * Uses endpoint: PUT /api/health/info/:student_id
   */
  updateHealthInfo: async (
    studentId: string, 
    healthData: UpdateHealthInfoData
  ): Promise<ApiResponse<HealthInfo>> => {
    return ApiService.put<HealthInfo>(`/health/info/${studentId}`, healthData);
  },

  /**
   * Get health statistics (Admin/Teacher only)
   * Uses endpoint: GET /api/health/statistics
   */
  getHealthStatistics: async (): Promise<ApiResponse<any>> => {
    return ApiService.get<any>('/health/statistics');
  },
};
