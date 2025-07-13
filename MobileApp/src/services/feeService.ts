import { ApiService } from './api';
import { ApiResponse } from '../types';

// Fee types for mobile app
export interface FeeCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface FeeStudent {
  _id: string;
  fullName: string;
  rollNum: string;
}

export interface Fee {
  id: string;
  title: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'paid';
  student_id: FeeStudent;
  createdBy: FeeCreatedBy;
  created_at: string;
  updated_at: string;
}

export interface FeeFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'paid';
  year?: string;
  sortBy?: 'deadline' | 'amount' | 'title' | 'status' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface FeePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StudentFeesResponse {
  fees: Fee[];
  pagination: FeePagination;
  student: {
    _id: string;
    fullName: string;
    rollNum: string;
  };
}

export interface FeeSummary {
  student: {
    id: string;
    fullName: string;
    rollNum: string;
  };
  fees: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  amounts: {
    total: number;
    paid: number;
    pending: number;
  };
  year: number;
}

/**
 * Fee service for handling all fee/payment-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const feeService = {
  /**
   * Get fees for a student with pagination and filters (mobile app)
   * Uses existing endpoint: GET /api/fees/:student_id
   */
  getStudentFees: async (
    studentId: string,
    filters?: FeeFilters
  ): Promise<ApiResponse<StudentFeesResponse>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = queryString
      ? `/fees/${studentId}?${queryString}`
      : `/fees/${studentId}`;

    return ApiService.get<StudentFeesResponse>(url);
  },

  /**
   * Get fee summary for a student (mobile app)
   * Uses existing endpoint: GET /api/fees/summary/:student_id
   */
  getFeeSummary: async (
    studentId: string,
    year?: string
  ): Promise<ApiResponse<FeeSummary>> => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);

    const queryString = params.toString();
    const url = queryString
      ? `/fees/summary/${studentId}?${queryString}`
      : `/fees/summary/${studentId}`;

    return ApiService.get<FeeSummary>(url);
  },
};