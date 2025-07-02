import { ApiService } from './api';
import { ApiResponse } from '../types';

// Class types for mobile app
export interface ClassStudent {
  _id: string;
  fullName: string;
  rollNum: number;
  photoUrl?: string;
}

export interface ClassTeacher {
  _id: string;
  name: string;
  email: string;
}

export interface EnrolledClass {
  _id: string;
  name: string;
  description?: string;
  teachers: ClassTeacher[];
  students: ClassStudent[];
  createdAt: string;
  updatedAt: string;
}



/**
 * Class service for handling all class-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const classService = {
  /**
   * Get classes for enrolled teacher (mobile app)
   * Uses existing endpoint: GET /api/classes/enrolled-teacher
   */
  getEnrolledTeacherClasses: async (): Promise<ApiResponse<EnrolledClass[]>> => {
    return ApiService.get<EnrolledClass[]>('/classes/enrolled-teacher');
  },
};
