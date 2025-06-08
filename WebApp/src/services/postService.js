import { api } from "./api.js";

export const postService = {
  // Basic CRUD operations
  getPosts: () => api.get("/posts"),
  getPaginatedPosts: (page = 1, limit = 10) =>
    api.get(`/posts/paginated?page=${page}&limit=${limit}`),
  getPostStatistics: () => api.get("/posts/statistics"),
  getPostById: (postId) => api.get(`/posts/${postId}`),

  // Create/Update with media upload
  createPost: (formData) =>
    api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePost: (postId, formData) =>
    api.put(`/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePost: (postId) => api.delete(`/posts/${postId}`),

  // Audience management - Students
  getPostStudents: (postId, params) =>
    api.get(`/posts/${postId}/students`, { params }),
  addStudentsToPost: (postId, studentIds) =>
    api.post(`/posts/${postId}/students`, { student_ids: studentIds }),
  removeStudentsFromPost: (postId, studentIds) =>
    api.delete(`/posts/${postId}/students`, {
      data: { student_ids: studentIds },
    }),

  // Audience management - Classes
  getPostClasses: (postId, params) =>
    api.get(`/posts/${postId}/classes`, { params }),
  addClassesToPost: (postId, classIds) =>
    api.post(`/posts/${postId}/classes`, { class_ids: classIds }),
  removeClassesFromPost: (postId, classIds) =>
    api.delete(`/posts/${postId}/classes`, { data: { class_ids: classIds } }),
};
