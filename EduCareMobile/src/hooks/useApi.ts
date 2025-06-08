import { useState } from 'react';

export default function useApi(apiCall: (...args: any[]) => Promise<any>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const request = async (...args: any[]) => {
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
