import { createContext, useContext, useState, useEffect, useCallback } from "react";
import mainApi from "./APIs";
import { useNavigate } from "react-router";

 
const CurrentUserContext = createContext(null);

// 1. Create a Provider Component to wrap your app
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("access_token")));
  function logout(){
    localStorage.removeItem("access_token")
    setCurrentUser(null)
    navigate("/login",{replace: true})
  }
  const fetchUser = useCallback( async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await mainApi.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
  ,[])
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]); // Empty array ensures this runs only once on mount

  return (
    <CurrentUserContext.Provider value={{ logout, currentUser, setCurrentUser, loading,fetchUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

// 2. Create a custom hook for easy access in other components
// eslint-disable-next-line react-refresh/only-export-components
export function useCurrentUser() {
  return useContext(CurrentUserContext);
}

