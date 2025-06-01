import { useState } from "react";
import { Form } from "antd";
import { handleApiError, ERROR_DISPLAY_TYPES, ERROR_TYPES } from "../utils/errorHandler";

/**
 * Enhanced useApi hook specifically designed for form submissions
 * Provides automatic form validation error handling and field-specific error display
 */
export default function useApiForm(apiCall, options = {}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  // Default options for form-specific error handling
  const defaultOptions = {
    displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
    showValidationDetails: true,
    setFormErrors: true, // Automatically set form field errors
    clearFormOnSuccess: false,
    ...options,
  };

  const request = async (formData, customOptions = {}) => {
    const finalOptions = { ...defaultOptions, ...customOptions };
    
    setIsLoading(true);
    setError(null);
    setErrorInfo(null);

    try {
      const response = await apiCall(formData);
      setData(response.data);

      // Clear form if requested
      if (finalOptions.clearFormOnSuccess) {
        form.resetFields();
      }

      return response.data;
    } catch (err) {
      const parsedError = handleApiError(err, finalOptions);
      
      setError(err);
      setErrorInfo(parsedError);

      // Set form field errors for validation errors
      if (finalOptions.setFormErrors && parsedError.type === ERROR_TYPES.VALIDATION) {
        setFormFieldErrors(parsedError.details);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set form field errors from validation error details
   * @param {Array} validationErrors - Array of validation error objects
   */
  const setFormFieldErrors = (validationErrors) => {
    if (!Array.isArray(validationErrors)) return;

    const fieldErrors = {};

    validationErrors.forEach(error => {
      const fieldName = error.field || error.path || error.param;
      const errorMessage = error.message || error.msg || String(error);

      if (fieldName) {
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(errorMessage);
      }
    });

    // Set errors on form fields
    const formFields = Object.keys(fieldErrors).map(fieldName => ({
      name: fieldName,
      errors: fieldErrors[fieldName],
    }));

    form.setFields(formFields);
  };

  /**
   * Clear all form errors
   */
  const clearFormErrors = () => {
    const formFields = form.getFieldsError()
      .filter(({ errors }) => errors.length > 0)
      .map(({ name }) => ({ name, errors: [] }));
    
    form.setFields(formFields);
  };

  /**
   * Submit form with automatic validation and error handling
   */
  const submitForm = async (customOptions = {}) => {
    try {
      // Validate form first
      const values = await form.validateFields();
      
      // Clear any previous form errors
      clearFormErrors();
      
      // Submit the form
      return await request(values, customOptions);
    } catch (validationError) {
      // Form validation failed
      console.log('Form validation failed:', validationError);
      throw validationError;
    }
  };

  const clearData = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
    setErrorInfo(null);
    clearFormErrors();
  };

  return {
    form,
    request,
    submitForm,
    isLoading,
    error,
    data,
    errorInfo,
    clearData,
    clearFormErrors,
    setFormFieldErrors,
  };
}
