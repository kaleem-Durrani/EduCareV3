import React from 'react';

/**
 * Reusable error message component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {string} props.title - Error title
 * @param {string} props.type - Error type (error, warning, info)
 * @param {Function} props.onRetry - Retry function
 * @param {Function} props.onDismiss - Dismiss function
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Error message component
 */
const ErrorMessage = ({ 
  message, 
  title = 'Error', 
  type = 'error',
  onRetry,
  onDismiss,
  className = ''
}) => {
  const typeStyles = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const styles = typeStyles[type];

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!message) return null;

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          <div className={`mt-1 text-sm ${styles.message}`}>
            {message}
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`text-sm px-3 py-1 rounded text-white ${styles.button} transition-colors`}
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${styles.icon} hover:bg-gray-100 transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
