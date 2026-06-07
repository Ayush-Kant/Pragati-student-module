import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated, userRole } = useAuth();
  
  // Allow bypass via localStorage for development
  const bypassAuth = localStorage.getItem("BYPASS_AUTH") === "true";
  
  if (!isAuthenticated && !bypassAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole && !bypassAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;