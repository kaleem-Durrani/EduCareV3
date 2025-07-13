import { ApiService } from './api';
import { ApiResponse } from '../types';

// Lost Item types for mobile app
export interface LostItemClaimedBy {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

export interface LostItem {
  _id: string;
  title: string;
  description: string;
  dateFound: string;
  imageUrl?: string;
  status: 'unclaimed' | 'claimed';
  claimedBy?: LostItemClaimedBy;
  claimedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LostItemFilters {
  page?: number;
  limit?: number;
  status?: 'unclaimed' | 'claimed';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface LostItemPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LostItemsResponse {
  items: LostItem[];
  pagination: LostItemPagination;
}

export interface LostItemStatistics {
  totalItems: number;
  claimedItems: number;
  unclaimedItems: number;
  recentItems: number;
}

/**
 * Lost Item service for handling all lost item-related API calls in mobile app
 * Uses existing backend endpoints - marked for mobile app use
 */
export const lostItemService = {
  /**
   * Get lost items with filtering and pagination (mobile app)
   * Uses existing endpoint: GET /api/lost-items
   */
  getLostItems: async (
    filters?: LostItemFilters
  ): Promise<ApiResponse<LostItemsResponse>> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/lost-items?${queryString}` : '/lost-items';

    return ApiService.get<LostItemsResponse>(url);
  },

  /**
   * Get lost items statistics (mobile app)
   * Uses existing endpoint: GET /api/lost-items/statistics
   */
  getLostItemStatistics: async (): Promise<ApiResponse<LostItemStatistics>> => {
    return ApiService.get<LostItemStatistics>('/lost-items/statistics');
  },

  /**
   * Get specific lost item (mobile app)
   * Uses existing endpoint: GET /api/lost-items/:item_id
   */
  getLostItemById: async (itemId: string): Promise<ApiResponse<LostItem>> => {
    return ApiService.get<LostItem>(`/lost-items/${itemId}`);
  },
};