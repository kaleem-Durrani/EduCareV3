import { useState } from 'react';

export interface UseApiState<T> {
  isLoading: boolean;
  error: any;
  data: T | null;
  response: any;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  request: (...args: any[]) => Promise<T>;
  clearData: () => void;
}

export default function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<any>
): UseApiReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const [response, setResponse] = useState<any>(null);

  const request = async (...args: any[]): Promise<T> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiCall(...args);

      // Axios successful response structure
      setData(response.data);
      setResponse(response);
      return response.data; // Return data for easier access
    } catch (err) {
      setError(err);
      // Re-throw the error so components can still catch it if needed
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
    setResponse(null);
  };

  return {
    request,
    isLoading,
    error,
    data,
    response,
    clearData,
  };
}
