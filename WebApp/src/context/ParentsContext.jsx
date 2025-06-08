import { createContext, useContext, useState, useEffect } from "react";
import { parentService } from "../services";
import useApi from "../hooks/useApi";
import { useAuth } from "./AuthContext";

const ParentsContext = createContext({
  parents: [],
  loading: false,
  error: null,
  errorMessage: null,
  refreshParents: async () => {},
});

export const useParentsContext = () => useContext(ParentsContext);

export const ParentsProvider = ({ children }) => {
  const [parents, setParents] = useState([]);
  const { user } = useAuth();

  const {
    data: parentsData,
    isLoading: loading,
    request: getParents,
    error,
    errorInfo,
  } = useApi(parentService.getParentsForSelect);

  const fetchParents = async () => {
    if (!parents.length && user) {
      await getParents();
    }
  };

  const refreshParents = async () => {
    setParents([]);
    if (user) {
      await getParents();
    }
  };

  useEffect(() => {
    if (user) {
      fetchParents();
    } else {
      setParents([]);
    }
  }, [user]);

  useEffect(() => {
    if (parentsData && parentsData.length > 0) {
      setParents(parentsData);
    } else {
      setParents([]);
    }
  }, [parentsData]);

  return (
    <ParentsContext.Provider
      value={{
        parents,
        loading,
        error,
        errorMessage: errorInfo?.message || null,
        refreshParents,
      }}
    >
      {children}
    </ParentsContext.Provider>
  );
};
