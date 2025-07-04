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

class NoteService {
  private api: ApiService;

  constructor() {
    this.api = new ApiService();
  }

  // Get notes for a specific student
  async getStudentNotes(
    studentId: string,
    filters: NotesFilters = {}
  ): Promise<ApiResponse<StudentNotesResponse>> {
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

    return this.api.get(url);
  }

  // Create a new note
  async createNote(data: CreateNoteData): Promise<ApiResponse<{ note: Note }>> {
    return this.api.post('/notes', data);
  }

  // Update a note
  async updateNote(noteId: string, data: UpdateNoteData): Promise<ApiResponse<{ note: Note }>> {
    return this.api.put(`/notes/${noteId}`, data);
  }

  // Delete a note
  async deleteNote(noteId: string): Promise<ApiResponse<null>> {
    return this.api.delete(`/notes/${noteId}`);
  }
}

export const noteService = new NoteService();
