import { ApiService } from './api';
import { ApiResponse } from '../types';
import { StudentBoxStatus } from './boxService';

// Parent-specific types
export interface ParentStudent {
  _id: string;
  fullName: string;
  rollNum: number;
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  current_class: {
    _id: string;
    name: string;
  };
  relationshipType: string;
  photoUrl?: string;
  is_active: boolean;
}

export interface StudentBasicInfo {
  _id: string;
  fullName: string;
  rollNum: number;
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  current_class: {
    _id: string;
    name: string;
  };
  photoUrl?: string;
  is_active: boolean;
  contacts: Array<{
    _id: string;
    name: string;
    relationship: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    is_primary: boolean;
    is_emergency: boolean;
  }>;
  health_info: {
    allergies: string[];
    medical_conditions: string[];
    medications: string[];
    emergency_contact: string;
    doctor_name?: string;
    doctor_phone?: string;
  };
}

/**
 * Parent service for handling all parent-specific API calls in mobile app
 * Uses existing backend endpoints for parent functionality
 */
export const parentService = {
  /**
   * Get students for logged-in parent
   * Uses existing endpoint: GET /api/parent/students
   */
  getParentStudents: async (): Promise<ApiResponse<ParentStudent[]>> => {
    return ApiService.get<ParentStudent[]>('/parent/students');
  },

  /**
   * Get student basic info for parent
   * Uses existing endpoint: GET /api/student/:student_id/basic-info
   */
  getStudentBasicInfo: async (studentId: string): Promise<ApiResponse<StudentBasicInfo>> => {
    return ApiService.get<StudentBasicInfo>(`/student/${studentId}/basic-info`);
  },

  /**
   * Get child's box status for parent
   * Uses existing endpoint: GET /api/box/student/:student_id
   * Backend handles parent authentication and access control
   */
  getChildBoxStatus: async (studentId: string): Promise<ApiResponse<StudentBoxStatus>> => {
    return ApiService.get<StudentBoxStatus>(`/box/student/${studentId}`);
  },
};
