import React from 'react';

/**
 * Reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner (sm, md, lg, xl)
 * @param {string} props.color - Color of spinner
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullScreen - Whether to show as full screen overlay
 * @param {string} props.text - Loading text to display
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'purple', 
  className = '', 
  fullScreen = false,
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    border-4 border-t-transparent rounded-full animate-spin
    ${className}
  `.trim();

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={spinnerClasses}></div>
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
