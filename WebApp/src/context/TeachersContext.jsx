import { createContext, useContext, useState, useEffect } from "react";
import { teacherService } from "../services";
import useApi from "../hooks/useApi";
import { useAuth } from "./AuthContext";

const TeachersContext = createContext({
  teachers: [],
  loading: false,
  error: null,
  errorMessage: null,
  refreshTeachers: async () => {},
});

export const useTeachersContext = () => useContext(TeachersContext);

export const TeachersProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);
  const { user } = useAuth();

  const {
    data: teachersData,
    isLoading: loading,
    request: getTeachers,
    error,
    errorInfo,
  } = useApi(teacherService.getTeachersForSelect);

  const fetchTeachers = async () => {
    if (!teachers.length && user) {
      await getTeachers();
    }
  };

  const refreshTeachers = async () => {
    setTeachers([]);
    if (user) {
      await getTeachers();
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeachers();
    } else {
      setTeachers([]);
    }
  }, [user]);

  useEffect(() => {
    if (teachersData && teachersData.length > 0) {
      setTeachers(teachersData);
    } else {
      setTeachers([]);
    }
  }, [teachersData]);

  return (
    <TeachersContext.Provider
      value={{
        teachers,
        loading,
        error,
        errorMessage: errorInfo?.message || null,
        refreshTeachers,
      }}
    >
      {children}
    </TeachersContext.Provider>
  );
};
