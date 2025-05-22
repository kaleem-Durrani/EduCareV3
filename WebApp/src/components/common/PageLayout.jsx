import React from 'react';

/**
 * Standard page layout component for consistent page structure
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 * @param {React.ReactNode} props.children - Page content
 * @param {React.ReactNode} props.actions - Action buttons/components
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Page layout component
 */
const PageLayout = ({ 
  title, 
  subtitle, 
  children, 
  actions,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
