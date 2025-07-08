import { ApiService } from './api';
import { ApiResponse } from '../types';

// Box types for mobile app
export interface BoxItem {
  _id: string;
  name: string;
  description: string;
  defaultInStock: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentBoxItemStatus {
  item_id: {
    _id: string;
    name: string;
    description: string;
  };
  has_item: boolean;
  notes: string;
}

export interface StudentBoxStatus {
  _id: string;
  student_id: {
    _id: string;
    fullName: string;
    rollNum: number;
  };
  items: StudentBoxItemStatus[];
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBoxStatusData {
  items: {
    item_id: string;
    has_item: boolean;
    notes: string;
  }[];
}

/**
 * Box service for handling all box-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const boxService = {
  /**
   * Get student's box status (mobile app - teacher use)
   * Uses existing endpoint: GET /api/box/student/:student_id
   */
  getStudentBoxStatus: async (studentId: string): Promise<ApiResponse<StudentBoxStatus>> => {
    return ApiService.get<StudentBoxStatus>(`/box/student/${studentId}`);
  },

  /**
   * Update student's box status (mobile app - teacher use)
   * Uses existing endpoint: PUT /api/box/student/:student_id
   */
  updateStudentBoxStatus: async (
    studentId: string,
    statusData: UpdateBoxStatusData
  ): Promise<ApiResponse<StudentBoxStatus>> => {
    return ApiService.put<StudentBoxStatus>(`/box/student/${studentId}`, statusData);
  },

  /**
   * Get child's box status for parent (mobile app - parent use)
   * Uses existing endpoint: GET /api/box/student/:student_id
   * Backend already handles parent authentication and access control
   */
  getChildBoxStatusForParent: async (studentId: string): Promise<ApiResponse<StudentBoxStatus>> => {
    return ApiService.get<StudentBoxStatus>(`/box/student/${studentId}`);
  },
};
