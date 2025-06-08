import { createContext, useContext, useState, useEffect } from "react";
import { classService } from "../services";
import useApi from "../hooks/useApi";
import { useAuth } from "./AuthContext";

const ClassesContext = createContext({
  classes: [],
  loading: false,
  error: null,
  errorMessage: null,
  refreshClasses: async () => {},
});

export const useClassesContext = () => useContext(ClassesContext);

export const ClassesProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const { user } = useAuth();

  const {
    data: classesData,
    isLoading: loading,
    request: getClasses,
    error,
    errorInfo,
  } = useApi(classService.getClassesForSelect);

  const fetchClasses = async () => {
    if (!classes.length && user) {
      await getClasses();
    }
  };

  const refreshClasses = async () => {
    setClasses([]);
    if (user) {
      await getClasses();
    }
  };

  useEffect(() => {
    if (user) {
      fetchClasses();
    } else {
      setClasses([]);
    }
  }, [user]);

  useEffect(() => {
    if (classesData && classesData.length > 0) {
      setClasses(classesData);
    } else {
      setClasses([]);
    }
  }, [classesData]);

  return (
    <ClassesContext.Provider
      value={{
        classes,
        loading,
        error,
        errorMessage: errorInfo?.message || null,
        refreshClasses,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
};
