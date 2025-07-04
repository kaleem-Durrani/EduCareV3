import { ApiService } from './api';
import { ApiResponse } from '../types';

// Note types for mobile app
export interface Note {
  _id: string;
  student_id: {
    _id: string;
    fullName: string;
    profilePicture?: string;
    class_id: {
      _id: string;
      name: string;
    };
  };
  content: string;
  createdBy: {
    _id: string;
    fullName: string;
    role: string;
  };
  updatedBy?: {
    _id: string;
    fullName: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  student_id: string;
  content: string;
}

export interface UpdateNoteData {
  content: string;
}

export interface StudentNotesResponse {
  notes: Note[];
  student: {
    _id: string;
    fullName: string;
    profilePicture?: string;
    class: {
      _id: string;
      name: string;
    };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    dateFrom?: string;
    dateTo?: string;
    createdBy?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export interface NotesFilters {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'content';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Note service for handling all note-related API calls
 */
export const noteService = {
  /**
   * Get notes for a specific student with pagination and filters
   */
  getStudentNotes: async (
    studentId: string,
    filters: NotesFilters = {}
  ): Promise<ApiResponse<StudentNotesResponse>> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = `/notes/student/${studentId}${queryString ? `?${queryString}` : ''}`;

    return ApiService.get(url);
  },

  /**
   * Create a new note
   */
  createNote: async (data: CreateNoteData): Promise<ApiResponse<{ note: Note }>> => {
    return ApiService.post('/notes', data);
  },

  /**
   * Update an existing note
   */
  updateNote: async (noteId: string, data: UpdateNoteData): Promise<ApiResponse<{ note: Note }>> => {
    return ApiService.put(`/notes/${noteId}`, data);
  },

  /**
   * Delete a note
   */
  deleteNote: async (noteId: string): Promise<ApiResponse<null>> => {
    return ApiService.delete(`/notes/${noteId}`);
  },
};
