// import { axiosInstance } from "../config/config";
// import { createContext, useContext, useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import LoginPage from "../pages/globals/LoginPage/LoginPage";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const fetchCurrentUser = async () => {
//     try {
//       setError(null);
//       const response = await axiosInstance.get('/api/v1/user/currentUser', {
//         timeout: 5000, // 5 second timeout
//         retry: 3, // Retry 3 times
//         retryDelay: 1000 // Wait 1 second between retries
//       });

//       if (response.data.success) {
//         setUser(response.data.data);
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//         setError('Authentication failed');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Network connection failed';
//       console.error("Auth Error:", errorMessage);
//       setError(errorMessage);
//       setIsAuthenticated(false);
//       setUser(null);
      
//       // Redirect to login if unauthorized or network error
//       if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
//         navigate('/', { replace: true });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setError(null);
//       const response = await axiosInstance.post('/api/v1/user/logout');
//       if (response.data.success) {
//         setUser(null);
//         setIsAuthenticated(false);
//         navigate("/", { replace: true });
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Logout failed';
//       console.error("Logout Error:", errorMessage);
//       setError(errorMessage);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentUser();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider
//       value={{ 
//         isAuthenticated, 
//         logout, 
//         loading, 
//         user, 
//         fetchCurrentUser,
//         error 
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export { AuthProvider, useAuth };



import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginPage from "../pages/globals/LoginPage/LoginPage";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/currentUser",
        {
          withCredentials: true,
        }
      );
      //console.log(response.data.data);
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.log("Error from context");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setIsAuthenticated(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout`:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, logout, loading, user, fetchCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};
export { AuthProvider, useAuth };
