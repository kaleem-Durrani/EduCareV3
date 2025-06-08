import { api } from "./api.js";

export const lostItemService = {
  getLostItemsStatistics: () => api.get("/lost-items/statistics"),
  getAllLostItems: (params = {}) => api.get("/lost-items", { params }),
  getLostItemById: (itemId) => api.get(`/lost-items/${itemId}`),
  createLostItem: (itemData) =>
    api.post("/lost-items", itemData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateLostItem: (itemId, itemData) =>
    api.put(`/lost-items/${itemId}`, itemData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  claimLostItem: (itemId, claimData) =>
    api.post(`/lost-items/${itemId}/claim`, claimData),
  deleteLostItem: (itemId) => api.delete(`/lost-items/${itemId}`),
  getItemImage: (itemId) => api.get(`/lost-items/${itemId}/image`),
};
