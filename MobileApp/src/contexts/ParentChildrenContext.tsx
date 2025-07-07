import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from '../hooks';
import { parentService, ParentStudent } from '../services';

// Context types
interface ParentChildrenContextType {
  // Data
  children: ParentStudent[];
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshChildren: () => Promise<void>;
  getChildById: (studentId: string) => ParentStudent | undefined;
  getChildrenByClass: (classId: string) => ParentStudent[];
}

// Create context
const ParentChildrenContext = createContext<ParentChildrenContextType | undefined>(undefined);

// Provider props
interface ParentChildrenProviderProps {
  children: ReactNode;
  userRole?: string; // Only initialize for parents
}

// Provider component
export const ParentChildrenProvider: React.FC<ParentChildrenProviderProps> = ({
  children,
  userRole
}) => {
  // API hook for fetching parent's children
  const {
    request: fetchChildren,
    isLoading,
    error,
    data: childrenData
  } = useApi<ParentStudent[]>(parentService.getParentStudents);

  // Initialize data when component mounts (only for parents)
  useEffect(() => {
    if (userRole === 'parent') {
      loadChildren();
    }
  }, [userRole]);

  // Load children data
  const loadChildren = async () => {
    try {
      await fetchChildren();
    } catch (err) {
      console.error('Failed to load children:', err);
    }
  };

  // Refresh function (public API)
  const refreshChildren = async () => {
    await loadChildren();
  };

  // Helper function to get child by ID
  const getChildById = (studentId: string): ParentStudent | undefined => {
    return childrenData?.find(child => child._id === studentId);
  };

  // Helper function to get children by class
  const getChildrenByClass = (classId: string): ParentStudent[] => {
    if (!childrenData) return [];
    return childrenData.filter(child => child.current_class?._id === classId);
  };

  // Context value
  const contextValue: ParentChildrenContextType = {
    // Data
    children: childrenData || [],
    
    // Loading and error states
    isLoading,
    error,
    
    // Actions
    refreshChildren,
    getChildById,
    getChildrenByClass,
  };

  return (
    <ParentChildrenContext.Provider value={contextValue}>
      {children}
    </ParentChildrenContext.Provider>
  );
};

// Custom hook to use the context
export const useParentChildren = (): ParentChildrenContextType => {
  const context = useContext(ParentChildrenContext);
  
  if (context === undefined) {
    throw new Error('useParentChildren must be used within a ParentChildrenProvider');
  }
  
  return context;
};
