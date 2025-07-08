import { ApiService } from './api';
import { ApiResponse } from '../types';

// Lost Item types for mobile app
export interface LostItem {
  _id: string;
  name: string;
  description: string;
  location: string;
  dateFound: string;
  status: 'found' | 'claimed' | 'returned';
  imageUrl?: string;
  claimedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  claimedDate?: string;
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

export interface CreateLostItemData {
  name: string;
  description: string;
  location: string;
  dateFound: string;
  image?: File; // For image upload
}

export interface UpdateLostItemData {
  name?: string;
  description?: string;
  location?: string;
  dateFound?: string;
  status?: 'found' | 'claimed' | 'returned';
  image?: File; // For image upload
}

export interface LostItemFilters {
  page?: number;
  limit?: number;
  status?: 'found' | 'claimed' | 'returned';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LostItemPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedLostItemsResponse {
  lostItems: LostItem[];
  pagination: LostItemPagination;
}

export interface LostItemStatistics {
  totalItems: number;
  foundItems: number;
  claimedItems: number;
  returnedItems: number;
}

/**
 * Lost Item service for handling all lost item-related API calls in mobile app
 */
export const lostItemService = {
  /**
   * Get all lost items with pagination and filters
   * Uses endpoint: GET /api/lost-items
   */
  getAllLostItems: async (filters?: LostItemFilters): Promise<ApiResponse<PaginatedLostItemsResponse>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const queryString = params.toString();
    const url = queryString ? `/lost-items?${queryString}` : '/lost-items';

    return ApiService.get<PaginatedLostItemsResponse>(url);
  },

  /**
   * Get specific lost item by ID
   * Uses endpoint: GET /api/lost-items/:item_id
   */
  getLostItemById: async (itemId: string): Promise<ApiResponse<LostItem>> => {
    return ApiService.get<LostItem>(`/lost-items/${itemId}`);
  },

  /**
   * Create new lost item (Admin/Teacher only)
   * Uses endpoint: POST /api/lost-items
   */
  createLostItem: async (itemData: CreateLostItemData): Promise<ApiResponse<LostItem>> => {
    const formData = new FormData();
    
    formData.append('name', itemData.name);
    formData.append('description', itemData.description);
    formData.append('location', itemData.location);
    formData.append('dateFound', itemData.dateFound);
    
    if (itemData.image) {
      formData.append('image', itemData.image);
    }

    return ApiService.post<LostItem>('/lost-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update lost item (Admin/Teacher only)
   * Uses endpoint: PUT /api/lost-items/:item_id
   */
  updateLostItem: async (itemId: string, itemData: UpdateLostItemData): Promise<ApiResponse<LostItem>> => {
    const formData = new FormData();
    
    if (itemData.name) formData.append('name', itemData.name);
    if (itemData.description) formData.append('description', itemData.description);
    if (itemData.location) formData.append('location', itemData.location);
    if (itemData.dateFound) formData.append('dateFound', itemData.dateFound);
    if (itemData.status) formData.append('status', itemData.status);
    
    if (itemData.image) {
      formData.append('image', itemData.image);
    }

    return ApiService.put<LostItem>(`/lost-items/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete lost item (Admin/Teacher only)
   * Uses endpoint: DELETE /api/lost-items/:item_id
   */
  deleteLostItem: async (itemId: string): Promise<ApiResponse<null>> => {
    return ApiService.delete<null>(`/lost-items/${itemId}`);
  },

  /**
   * Claim lost item (Admin/Teacher only)
   * Uses endpoint: POST /api/lost-items/:item_id/claim
   */
  claimLostItem: async (itemId: string, claimerEmail: string): Promise<ApiResponse<LostItem>> => {
    return ApiService.post<LostItem>(`/lost-items/${itemId}/claim`, {
      claimerEmail
    });
  },

  /**
   * Get lost item statistics (Admin/Teacher only)
   * Uses endpoint: GET /api/lost-items/statistics
   */
  getLostItemStatistics: async (): Promise<ApiResponse<LostItemStatistics>> => {
    return ApiService.get<LostItemStatistics>('/lost-items/statistics');
  },

  /**
   * Get lost item image URL
   * Uses endpoint: GET /api/lost-items/:item_id/image
   */
  getLostItemImageUrl: (itemId: string): string => {
    return `${ApiService.getBaseUrl()}/lost-items/${itemId}/image`;
  },
};
