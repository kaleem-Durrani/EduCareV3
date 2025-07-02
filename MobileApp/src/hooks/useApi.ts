import { useState } from 'react';
import { ApiResponse } from '../types';

export interface UseApiState<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
  success: boolean;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  request: (...args: any[]) => Promise<void>;
  clearData: () => void;
}

export default function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [success, setSuccess] = useState(false);

  const request = async (...args: any[]): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setSuccess(false);

    // No try-catch here - error handling is done in the API service layer
    const response = await apiCall(...args);

    if (response.success) {
      setData(response.data || null);
      setSuccess(true);
    } else {
      setError(response.message || response.error || 'An error occurred');
      setSuccess(false);
    }

    setIsLoading(false);
  };

  const clearData = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
    setSuccess(false);
  };

  return {
    request,
    isLoading,
    error,
    data,
    success,
    clearData,
  };
}
