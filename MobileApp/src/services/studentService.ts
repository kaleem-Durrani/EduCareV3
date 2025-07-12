import { ApiService } from './api';
import { ApiResponse } from '../types';

// Student types for mobile app
export interface StudentContact {
  relationship: string;
  name: string;
  phone?: string;
  photoUrl?: string;
}

export interface StudentSchedule {
  time: string;
  days: string;
}

export interface StudentClass {
  _id: string;
  name: string;
  grade?: string;
  section?: string;
}

export interface StudentDetails {
  _id: string;
  fullName: string;
  rollNum: number;
  birthdate: string;
  schedule: StudentSchedule;
  allergies: string[];
  likes: string[];
  additionalInfo?: string;
  authorizedPhotos: boolean;
  photoUrl?: string;
  contacts: StudentContact[];
  current_class?: StudentClass;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Student service for handling all student-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const studentService = {
  /**
   * Get student by ID (detailed view) (mobile app)
   * Uses existing endpoint: GET /api/students/:student_id
   * For teachers and admins only
   */
  getStudentById: async (studentId: string): Promise<ApiResponse<StudentDetails>> => {
    return ApiService.get<StudentDetails>(`/students/${studentId}`);
  },

  /**
   * Get student basic info for parent (mobile app)
   * Uses existing endpoint: GET /api/student/:student_id/basic-info
   * For parents only - includes all necessary information for basic info screen
   */
  getStudentBasicInfoForParent: async (studentId: string): Promise<ApiResponse<StudentDetails>> => {
    return ApiService.get<StudentDetails>(`/student/${studentId}/basic-info`);
  },
};
