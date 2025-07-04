import { ApiService } from './api';
import { ApiResponse } from '../types';

// Activity types for mobile app
export interface ActivityAudience {
  type: 'all' | 'class' | 'student';
  class_id?: {
    _id: string;
    name: string;
  };
  student_id?: {
    _id: string;
    fullName: string;
    rollNum: number;
  };
}

export interface Activity {
  _id: string;
  title: string;
  description: string;
  date: string;
  color: string;
  audience: ActivityAudience;
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

export interface CreateActivityData {
  title: string;
  description: string;
  date: string;
  color?: string;
  audience: {
    type: 'all' | 'class' | 'student';
    class_id?: string;
    student_id?: string;
  };
}

export interface UpdateActivityData {
  title?: string;
  description?: string;
  date?: string;
  color?: string;
  audience?: {
    type: 'all' | 'class' | 'student';
    class_id?: string;
    student_id?: string;
  };
}

export interface ActivityFilters {
  startDate?: string;
  endDate?: string;
  classId?: string;
  studentId?: string;
  audienceType?: 'all' | 'class' | 'student';
  timeFilter?: 'all' | 'past' | 'today' | 'upcoming';
  page?: number;
  limit?: number;
}

export interface ActivityPagination {
  currentPage: number;
  totalPages: number;
  totalActivities: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedActivitiesResponse {
  activities: Activity[];
  pagination: ActivityPagination;
}

/**
 * Activity service for handling all activity-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const activityService = {
  /**
   * Get activities with filtering and pagination (mobile app)
   * Uses existing endpoint: GET /api/activities
   */
  getActivities: async (filters?: ActivityFilters): Promise<ApiResponse<PaginatedActivitiesResponse>> => {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.audienceType) params.append('audienceType', filters.audienceType);
    if (filters?.timeFilter) params.append('timeFilter', filters.timeFilter);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/activities?${queryString}` : '/activities';

    return ApiService.get<PaginatedActivitiesResponse>(url);
  },

  /**
   * Get specific activity (mobile app)
   * Uses existing endpoint: GET /api/activities/:activity_id
   */
  getActivityById: async (activityId: string): Promise<ApiResponse<Activity>> => {
    return ApiService.get<Activity>(`/activities/${activityId}`);
  },

  /**
   * Create activity (mobile app)
   * Uses existing endpoint: POST /api/activities
   */
  createActivity: async (activityData: CreateActivityData): Promise<ApiResponse<Activity>> => {
    return ApiService.post<Activity>('/activities', activityData);
  },

  /**
   * Update activity (mobile app)
   * Uses existing endpoint: PUT /api/activities/:activity_id
   */
  updateActivity: async (
    activityId: string, 
    activityData: UpdateActivityData
  ): Promise<ApiResponse<Activity>> => {
    return ApiService.put<Activity>(`/activities/${activityId}`, activityData);
  },

  /**
   * Delete activity (mobile app)
   * Uses existing endpoint: DELETE /api/activities/:activity_id
   */
  deleteActivity: async (activityId: string): Promise<ApiResponse<null>> => {
    return ApiService.delete<null>(`/activities/${activityId}`);
  },
};
