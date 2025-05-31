import { api } from './api.js';

export const lostItemService = {
  getAllLostItems: () => api.get('/lost-items'),
  getLostItemById: (itemId) => api.get(`/lost-items/${itemId}`),
  createLostItem: (itemData) => api.post('/lost-items', itemData),
  updateLostItem: (itemId, itemData) => api.put(`/lost-items/${itemId}`, itemData),
  deleteLostItem: (itemId) => api.delete(`/lost-items/${itemId}`),
  getItemImage: (itemId) => api.get(`/lost-items/${itemId}/image`),
};
