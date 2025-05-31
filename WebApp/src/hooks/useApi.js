import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

/**
 * Custom hook for API calls with loading, error, and success states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = false,
    onSuccess,
    onError,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = 'Operation completed successfully',
    deps = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      setData(result);
      
      if (showSuccessMessage) {
        message.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (showErrorMessage) {
        message.error(err.message || 'An error occurred');
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...deps]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook for API calls that need to be executed immediately on component mount
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useApiQuery = (apiFunction, options = {}) => {
  const { data, loading, error, execute } = useApi(apiFunction, {
    immediate: true,
    ...options,
  });

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
};

/**
 * Hook for API mutations (POST, PUT, DELETE operations)
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { mutate, loading, error, data }
 */
export const useApiMutation = (apiFunction, options = {}) => {
  const { data, loading, error, execute } = useApi(apiFunction, {
    immediate: false,
    showSuccessMessage: true,
    ...options,
  });

  return {
    mutate: execute,
    loading,
    error,
    data,
  };
};

/**
 * Hook for paginated API calls
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - Pagination state and controls
 */
export const useApiPagination = (apiFunction, options = {}) => {
  const {
    pageSize = 10,
    initialPage = 1,
    ...restOptions
  } = options;

  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize,
    total: 0,
  });

  const { data, loading, error, execute } = useApi(
    (...args) => apiFunction(...args, {
      page: pagination.current,
      limit: pagination.pageSize,
    }),
    {
      immediate: true,
      ...restOptions,
    }
  );

  const handleTableChange = useCallback((newPagination) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  useEffect(() => {
    if (data?.pagination) {
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
      }));
    }
  }, [data]);

  useEffect(() => {
    execute();
  }, [pagination.current, pagination.pageSize]);

  return {
    data: data?.data || [],
    loading,
    error,
    pagination,
    handleTableChange,
    refetch: execute,
  };
};

/**
 * Hook for form submissions with API calls
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - Form submission state and handler
 */
export const useApiForm = (apiFunction, options = {}) => {
  const {
    onSuccess,
    resetFormOnSuccess = false,
    form,
    ...restOptions
  } = options;

  const { mutate, loading, error } = useApiMutation(apiFunction, {
    onSuccess: (data) => {
      if (resetFormOnSuccess && form) {
        form.resetFields();
      }
      if (onSuccess) {
        onSuccess(data);
      }
    },
    ...restOptions,
  });

  const handleSubmit = useCallback(async (values) => {
    try {
      await mutate(values);
    } catch (err) {
      // Error is already handled by useApiMutation
      console.error('Form submission error:', err);
    }
  }, [mutate]);

  return {
    handleSubmit,
    loading,
    error,
  };
};

export default useApi;
