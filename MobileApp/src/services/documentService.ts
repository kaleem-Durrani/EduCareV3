import { ApiService } from './api';
import { ApiResponse } from '../types';

// Document types for mobile app
export interface StudentDocumentItem {
  document_type_id: {
    _id: string;
    name: string;
    description: string;
    required: boolean;
  };
  submitted: boolean;
  submission_date?: string;
  notes: string;
}

export interface StudentDocuments {
  _id: string;
  student_id: {
    _id: string;
    fullName: string;
    rollNum: number;
  };
  documents: StudentDocumentItem[];
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Document service for handling all document-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const documentService = {
  /**
   * Get student documents (mobile app)
   * Uses existing endpoint: GET /api/documents/student/:student_id
   */
  getStudentDocuments: async (studentId: string): Promise<ApiResponse<StudentDocuments>> => {
    return ApiService.get<StudentDocuments>(`/documents/student/${studentId}`);
  },
};
