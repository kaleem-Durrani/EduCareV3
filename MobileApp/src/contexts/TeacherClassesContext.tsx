import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from '../hooks';
import { classService, EnrolledClass, ClassStudent } from '../services';

// Context types
interface TeacherClassesContextType {
  // Data
  classes: EnrolledClass[];
  allStudents: ClassStudent[];
  studentsByClass: Record<string, ClassStudent[]>;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshClasses: () => Promise<void>;
}

// Create context
const TeacherClassesContext = createContext<TeacherClassesContextType | undefined>(undefined);

// Provider props
interface TeacherClassesProviderProps {
  children: ReactNode;
  userRole?: string; // Only initialize for teachers
}

// Provider component
export const TeacherClassesProvider: React.FC<TeacherClassesProviderProps> = ({
  children,
  userRole
}) => {
  const [allStudents, setAllStudents] = useState<ClassStudent[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<Record<string, ClassStudent[]>>({});

  // API hook for fetching enrolled classes
  const {
    request: fetchClasses,
    isLoading,
    error,
    data: classes
  } = useApi<EnrolledClass[]>(classService.getEnrolledTeacherClasses);

  // Initialize data when component mounts (only for teachers)
  useEffect(() => {
    if (userRole === 'teacher') {
      loadClasses();
    }
  }, [userRole]);

  // Update combined students list and students by class when classes change
  useEffect(() => {
    if (classes && classes.length > 0) {
      const combinedStudents: ClassStudent[] = [];
      const studentsMap: Record<string, ClassStudent[]> = {};

      classes.forEach(classItem => {
        if (classItem.students && classItem.students.length > 0) {
          combinedStudents.push(...classItem.students);
          studentsMap[classItem._id] = classItem.students;
        } else {
          studentsMap[classItem._id] = [];
        }
      });

      setAllStudents(combinedStudents);
      setStudentsByClass(studentsMap);
    } else {
      setAllStudents([]);
      setStudentsByClass({});
    }
  }, [classes]);

  // Load classes function
  const loadClasses = async () => {
    await fetchClasses();
  };

  // Refresh function (public API)
  const refreshClasses = async () => {
    await loadClasses();
  };

  // Context value
  const contextValue: TeacherClassesContextType = {
    // Data
    classes: classes || [],
    allStudents,
    studentsByClass,

    // Loading and error states
    isLoading,
    error,

    // Actions
    refreshClasses,
  };

  return (
    <TeacherClassesContext.Provider value={contextValue}>
      {children}
    </TeacherClassesContext.Provider>
  );
};

// Custom hook to use the context
export const useTeacherClasses = (): TeacherClassesContextType => {
  const context = useContext(TeacherClassesContext);
  
  if (context === undefined) {
    throw new Error('useTeacherClasses must be used within a TeacherClassesProvider');
  }
  
  return context;
};


