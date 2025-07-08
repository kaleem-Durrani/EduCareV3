import { ApiService } from './api';
import { ApiResponse } from '../types';

// Fee/Payment types for mobile app
export interface Fee {
  _id: string;
  student_id: string;
  type: 'tuition' | 'transport' | 'meal' | 'activity' | 'uniform' | 'book' | 'other';
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'card' | 'online';
  transactionId?: string;
  notes?: string;
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

export interface FeeSummary {
  student: {
    id?: string; // Backend uses 'id' instead of '_id'
    _id?: string; // Keep for compatibility
    fullName: string;
    rollNum: number;
    class?: {
      _id: string;
      name: string;
    };
  };
  fees?: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  amounts?: {
    total: number;
    paid: number;
    pending: number;
  };
  // Legacy properties for backward compatibility
  totalAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  overdueAmount?: number;
  totalFees?: number;
  paidFees?: number;
  pendingFees?: number;
  overdueFees?: number;
  recentPayments?: Fee[];
  upcomingDues?: Fee[];
  year?: number;
}

export interface CreateFeeData {
  student_id: string;
  type: 'tuition' | 'transport' | 'meal' | 'activity' | 'uniform' | 'book' | 'other';
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  notes?: string;
}

export interface UpdateFeeData {
  type?: 'tuition' | 'transport' | 'meal' | 'activity' | 'uniform' | 'book' | 'other';
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'card' | 'online';
  transactionId?: string;
  notes?: string;
}

export interface FeeFilters {
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type?: 'tuition' | 'transport' | 'meal' | 'activity' | 'uniform' | 'book' | 'other';
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  page?: number;
}

export interface PaginatedFeesResponse {
  fees: Fee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalFees: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface FeeStatistics {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  overdueFees: number;
  monthlyRevenue: {
    month: string;
    amount: number;
  }[];
}

/**
 * Fee service for handling all fee/payment-related API calls in mobile app
 */
export const feeService = {
  /**
   * Get fees for a student (Parent access)
   * Uses endpoint: GET /api/fees/:student_id
   */
  getStudentFees: async (
    studentId: string,
    filters?: FeeFilters
  ): Promise<ApiResponse<PaginatedFeesResponse>> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/fees/${studentId}?${queryString}` : `/fees/${studentId}`;

    return ApiService.get<PaginatedFeesResponse>(url);
  },

  /**
   * Get fee summary for a student (Parent access)
   * Uses endpoint: GET /api/fees/summary/:student_id
   */
  getFeeSummary: async (studentId: string): Promise<ApiResponse<FeeSummary>> => {
    return ApiService.get<FeeSummary>(`/fees/summary/${studentId}`);
  },

  /**
   * Create new fee (Admin/Teacher only)
   * Uses endpoint: POST /api/fees
   */
  createFee: async (feeData: CreateFeeData): Promise<ApiResponse<Fee>> => {
    return ApiService.post<Fee>('/fees', feeData);
  },

  /**
   * Update fee (Admin/Teacher only)
   * Uses endpoint: PUT /api/fees/:fee_id
   */
  updateFee: async (feeId: string, feeData: UpdateFeeData): Promise<ApiResponse<Fee>> => {
    return ApiService.put<Fee>(`/fees/${feeId}`, feeData);
  },

  /**
   * Update fee status (Admin/Teacher only)
   * Uses endpoint: PUT /api/fees/:fee_id/status
   */
  updateFeeStatus: async (
    feeId: string,
    status: 'pending' | 'paid' | 'overdue' | 'cancelled',
    paymentData?: {
      paymentDate?: string;
      paymentMethod?: 'cash' | 'bank_transfer' | 'card' | 'online';
      transactionId?: string;
      notes?: string;
    }
  ): Promise<ApiResponse<Fee>> => {
    return ApiService.put<Fee>(`/fees/${feeId}/status`, {
      status,
      ...paymentData,
    });
  },

  /**
   * Delete fee (Admin only)
   * Uses endpoint: DELETE /api/fees/:fee_id
   */
  deleteFee: async (feeId: string): Promise<ApiResponse<null>> => {
    return ApiService.delete<null>(`/fees/${feeId}`);
  },

  /**
   * Get fee statistics (Admin/Teacher only)
   * Uses endpoint: GET /api/fees/statistics
   */
  getFeeStatistics: async (): Promise<ApiResponse<FeeStatistics>> => {
    return ApiService.get<FeeStatistics>('/fees/statistics');
  },

  /**
   * Get all fees with filters (Admin/Teacher only)
   * Uses endpoint: GET /api/fees
   */
  getAllFees: async (filters?: FeeFilters): Promise<ApiResponse<PaginatedFeesResponse>> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/fees?${queryString}` : '/fees';

    return ApiService.get<PaginatedFeesResponse>(url);
  },
};
