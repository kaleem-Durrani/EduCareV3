import { useState } from "react";
import { handleApiError, ERROR_DISPLAY_TYPES } from "../utils/errorHandler";

export default function useApi(apiCall, options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [response, setResponse] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  // Default error handling options
  const defaultErrorOptions = {
    displayType: ERROR_DISPLAY_TYPES.MESSAGE,
    showValidationDetails: true,
    autoHandle: true,
    ...options.errorHandling,
  };

  const request = async (...args) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setErrorInfo(null);

    try {
      const response = await apiCall(...args);
      console.log(response);

      // API service returns response.data, which contains the backend response structure
      // Backend response: { success: true, message: "...", data: [...] }
      // Extract the actual data from the backend response structure
      setData(response.data);
      setResponse(response);
      return response.data; // Return data for easier access
    } catch (err) {
      // Use enhanced error handling
      const parsedError = handleApiError(err, defaultErrorOptions);

      setError(err);
      setErrorInfo(parsedError);

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
    setErrorInfo(null);
  };

  return {
    request,
    isLoading,
    error,
    data,
    response,
    errorInfo,
    clearData,
  };
}
