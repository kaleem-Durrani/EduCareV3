import { api } from './api.js';

export const postService = {
  getAllPosts: () => api.get('/posts'),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
};
