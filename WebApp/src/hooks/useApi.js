import { useState } from "react";

export default function useApi(apiCall) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const request = async (...args) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setErrorMessage(null);

    try {
      const response = await apiCall(...args);
      console.log(response);

      // Axios successful response structure
      setData(response.data);
      setResponse(response);
    } catch (err) {
      // Axios error structure
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response);
        setErrorMessage(err.message);
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        setError(err.request);
        setErrorMessage("Network error - no response received");
        console.log(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err);
        setErrorMessage(err.message);
        console.log("Error", err.message);
      }
    }

    setIsLoading(false);
  };

  const clearData = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
    setResponse(null);
    setErrorMessage(null);
  };

  return { request, isLoading, error, data, response, errorMessage, clearData };
}
