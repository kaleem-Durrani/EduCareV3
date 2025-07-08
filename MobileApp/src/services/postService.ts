import { ApiService } from './api';
import { ApiResponse } from '../types';

// Post types for mobile app
export interface PostMedia {
  type: 'image' | 'video';
  url: string;
  filename?: string;
}

export interface PostAudience {
  type: 'all' | 'class' | 'individual';
  class_ids?: {
    _id: string;
    name: string;
  }[];
  student_ids?: {
    _id: string;
    fullName: string;
    rollNum: number;
  }[];
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  media: PostMedia[];
  teacherId: {
    _id: string;
    name: string;
    email: string;
    photoUrl?: string;
  };
  audience: PostAudience;
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

export interface CreatePostData {
  title: string;
  content: string;
  audience: {
    type: 'all' | 'class' | 'individual';
    class_ids?: string[];
    student_ids?: string[];
  };
  media?: File[]; // For file uploads
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  audience?: {
    type: 'all' | 'class' | 'individual';
    class_ids?: string[];
    student_ids?: string[];
  };
  media?: File[]; // For file uploads
}

export interface PostFilters {
  teacherId?: string;
  classId?: string;
  studentId?: string;
  page?: number;
  limit?: number;
}

export interface PostPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedPostsResponse {
  posts: Post[];
  pagination: PostPagination;
}

/**
 * Post service for handling all post-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const postService = {
  /**
   * Get posts with filtering and pagination (mobile app)
   * Uses existing endpoint: GET /api/posts/paginated
   */
  getPosts: async (filters?: PostFilters): Promise<ApiResponse<PaginatedPostsResponse>> => {
    const params = new URLSearchParams();

    if (filters?.teacherId) params.append('teacherId', filters.teacherId);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `/posts/paginated?${queryString}` : '/posts/paginated';

    return ApiService.get<PaginatedPostsResponse>(url);
  },

  /**
   * Get posts for parent by student ID (for parent app - not implemented yet)
   * Uses endpoint: GET /api/posts/parent/:studentId
   */
  getPostsForParent: async (
    studentId: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedPostsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/posts/parent/${studentId}?${queryString}`
      : `/posts/parent/${studentId}`;

    return ApiService.get<PaginatedPostsResponse>(url);
  },

  /**
   * Get single post by ID (mobile app)
   * Uses existing endpoint: GET /api/posts/:post_id
   */
  getPostById: async (postId: string): Promise<ApiResponse<Post>> => {
    return ApiService.get<Post>(`/posts/${postId}`);
  },

  /**
   * Create post with media (mobile app)
   * Uses existing endpoint: POST /api/posts
   */
  createPost: async (postData: CreatePostData, mediaFiles?: File[]): Promise<ApiResponse<Post>> => {
    const formData = new FormData();

    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('audience', JSON.stringify(postData.audience));

    // Add media files
    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('images', file);
        } else if (file.type.startsWith('video/')) {
          formData.append('videos', file);
        }
      });
    }

    return ApiService.post<Post>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update post (mobile app)
   * Uses existing endpoint: PUT /api/posts/:post_id
   */
  updatePost: async (
    postId: string,
    postData: UpdatePostData,
    mediaFiles?: File[]
  ): Promise<ApiResponse<Post>> => {
    const formData = new FormData();

    if (postData.title !== undefined) formData.append('title', postData.title);
    if (postData.content !== undefined) formData.append('content', postData.content);
    if (postData.audience !== undefined)
      formData.append('audience', JSON.stringify(postData.audience));

    // Add media files
    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('images', file);
        } else if (file.type.startsWith('video/')) {
          formData.append('videos', file);
        }
      });
    }

    return ApiService.put<Post>(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete post (mobile app)
   * Uses existing endpoint: DELETE /api/posts/:post_id
   */
  deletePost: async (postId: string): Promise<ApiResponse<void>> => {
    return ApiService.delete<void>(`/posts/${postId}`);
  },

  /**
   * Get posts for parent's child (mobile app)
   * Uses parent-specific endpoint: GET /api/posts/parent/:studentId
   */
  getPostsForParent: async (studentId: string): Promise<ApiResponse<Post[]>> => {
    return ApiService.get<Post[]>(`/posts/parent/${studentId}`);
  },

  /**
   * Get paginated posts (alias for getPosts)
   * Uses existing endpoint: GET /api/posts/paginated
   */
  getPaginatedPosts: async (
    filters?: PostFilters
  ): Promise<ApiResponse<PaginatedPostsResponse>> => {
    return postService.getPosts(filters);
  },

  // Note: Statistics API removed - only needed for admin web app
};
