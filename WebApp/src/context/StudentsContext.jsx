import { createContext, useContext, useState, useEffect } from "react";
import { studentService } from "../services";
import useApi from "../hooks/useApi";
import { useAuth } from "./AuthContext";

const StudentsContext = createContext({
  students: [],
  loading: false,
  error: null,
  errorMessage: null,
  refreshStudents: async () => {},
});

export const useStudentsContext = () => useContext(StudentsContext);

export const StudentsProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const { user } = useAuth();

  const {
    data: studentsData,
    isLoading: loading,
    request: getStudents,
    error,
    errorInfo,
  } = useApi(studentService.getStudentsForSelect);

  const fetchStudents = async () => {
    if (!students.length && user) {
      await getStudents();
    }
  };

  const refreshStudents = async () => {
    setStudents([]);
    if (user) {
      await getStudents();
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [user]);

  useEffect(() => {
    if (studentsData && studentsData.length > 0) {
      setStudents(studentsData);
    } else {
      setStudents([]);
    }
  }, [studentsData]);

  return (
    <StudentsContext.Provider
      value={{
        students,
        loading,
        error,
        errorMessage: errorInfo?.message || null,
        refreshStudents,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};
