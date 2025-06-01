import { api } from "./api.js";

export const postService = {
  // EXACT MATCH WITH BACKEND ROUTES
  getPosts: () => api.get("/posts"),
  getPaginatedPosts: (page = 1, limit = 10) =>
    api.get(`/posts/paginated?page=${page}&limit=${limit}`),
  getPostStatistics: () => api.get("/posts/statistics"),
  getPostById: (postId) => api.get(`/posts/${postId}`),
  createPost: (postData) => api.post("/posts", postData),
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
};
