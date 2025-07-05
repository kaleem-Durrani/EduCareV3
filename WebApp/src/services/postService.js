import { api } from "./api.js";

export const postService = {
  // Basic CRUD operations
  getPaginatedPosts: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters.teacherId) params.append('teacherId', filters.teacherId);
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.studentId) params.append('studentId', filters.studentId);

    return api.get(`/posts/paginated?${params.toString()}`);
  },
  getPostStatistics: () => api.get("/posts/statistics"),
  getPostById: (postId) => api.get(`/posts/${postId}`),

  // Create/Update with media upload (supports multiple files)
  createPost: (formData) =>
    api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePost: (postId, formData) =>
    api.put(`/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePost: (postId) => api.delete(`/posts/${postId}`),

  // Audience management - Students (for editing posts)
  addStudentsToPost: (postId, studentIds) =>
    api.post(`/posts/${postId}/students`, { student_ids: studentIds }),
  removeStudentsFromPost: (postId, studentIds) =>
    api.delete(`/posts/${postId}/students`, {
      data: { student_ids: studentIds },
    }),

  // Audience management - Classes (for editing posts)
  addClassesToPost: (postId, classIds) =>
    api.post(`/posts/${postId}/classes`, { class_ids: classIds }),
  removeClassesFromPost: (postId, classIds) =>
    api.delete(`/posts/${postId}/classes`, { data: { class_ids: classIds } }),

  // Parent API (for future parent app)
  getPostsForParent: (studentId, page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return api.get(`/posts/parent/${studentId}?${params.toString()}`);
  },
};
