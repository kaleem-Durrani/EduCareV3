import React, { useState, useCallback } from "react";

/**
 * Custom hook for making API calls with loading, error, and data state management
 * @param {Function} apiCall - The API function to call
 * @returns {Object} - Object containing request function, loading state, error, data, and utility functions
 */
export default function useApi(apiCall) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const request = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      setErrorMessage(null);
      setResponse(null);

      try {
        const response = await apiCall(...args);

        if (response.error) {
          // Handle API errors
          setErrorMessage(response.error.message);
          setError(response.error);
          console.error("API Error:", response.error);
        } else {
          // Handle successful response
          setData(response.data?.data || response.data);
          setResponse(response);
        }

        return response;
      } catch (error) {
        // Handle unexpected errors
        const errorMsg = error.message || "An unexpected error occurred";
        setErrorMessage(errorMsg);
        setError(error);
        console.error("Unexpected Error:", error);

        return {
          data: null,
          error: {
            message: errorMsg,
            code: "UNEXPECTED_ERROR",
            details: error,
          },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  const clearData = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
    setResponse(null);
    setErrorMessage(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorMessage(null);
  }, []);

  return {
    request,
    isLoading,
    error,
    data,
    response,
    errorMessage,
    clearData,
    clearError,
  };
}

/**
 * Hook for making immediate API calls (useful for data fetching on component mount)
 * @param {Function} apiCall - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Options object
 * @returns {Object} - Object containing loading state, error, data, and utility functions
 */
export function useApiEffect(apiCall, dependencies = [], options = {}) {
  const { immediate = true, ...hookOptions } = options;
  const { request, ...rest } = useApi(apiCall);

  // Auto-execute on mount or dependency change
  React.useEffect(() => {
    if (immediate) {
      request();
    }
  }, dependencies);

  return {
    request,
    ...rest,
  };
}

/**
 * Hook for paginated API calls
 * @param {Function} apiCall - The API function to call
 * @param {Object} initialParams - Initial parameters for the API call
 * @returns {Object} - Object containing pagination state and functions
 */
export function usePaginatedApi(apiCall, initialParams = {}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { request, isLoading, error, data, errorMessage, clearError } =
    useApi(apiCall);

  const fetchPage = useCallback(
    async (pageNumber = page, size = pageSize, additionalParams = {}) => {
      const params = {
        ...initialParams,
        ...additionalParams,
        page: pageNumber,
        pageSize: size,
      };

      const response = await request(params);

      if (response && !response.error && response.data) {
        setTotal(response.data.total || 0);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil((response.data.total || 0) / size)
        );
        setPage(pageNumber);
        setPageSize(size);
      }

      return response;
    },
    [request, page, pageSize, initialParams]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      fetchPage(page + 1);
    }
  }, [page, totalPages, fetchPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      fetchPage(page - 1);
    }
  }, [page, fetchPage]);

  const goToPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        fetchPage(pageNumber);
      }
    },
    [totalPages, fetchPage]
  );

  const changePageSize = useCallback(
    (newSize) => {
      fetchPage(1, newSize);
    },
    [fetchPage]
  );

  return {
    // Data
    data,
    isLoading,
    error,
    errorMessage,

    // Pagination state
    page,
    pageSize,
    total,
    totalPages,

    // Functions
    fetchPage,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    clearError,

    // Computed properties
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    isEmpty:
      !isLoading && (!data || (Array.isArray(data) && data.length === 0)),
  };
}
