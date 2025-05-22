import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Protected Route component that requires authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string|Array} props.requiredRole - Required role(s) for access
 * @param {string} props.redirectTo - Where to redirect if not authenticated
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = ROUTES.LOGIN 
}) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if required
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(role)
      : role === requiredRole;

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" 
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go Back
              </button>
              
              <Navigate to={ROUTES.HOME} replace />
            </div>
          </div>
        </div>
      );
    }
  }

  // Render children if authenticated and authorized
  return children;
};

/**
 * Admin-only protected route
 */
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="admin" {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Teacher-only protected route
 */
export const TeacherRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="teacher" {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Parent-only protected route
 */
export const ParentRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="parent" {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Student-only protected route
 */
export const StudentRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="student" {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Multi-role protected route
 */
export const MultiRoleRoute = ({ roles, children, ...props }) => (
  <ProtectedRoute requiredRole={roles} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
