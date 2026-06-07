import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { userRole, isAuthenticated: isAuthenticatedCtx } = useAuth();
  
  // Allow bypass via localStorage for development
  const bypassAuth = localStorage.getItem("BYPASS_AUTH") === "true";
  const testRole = localStorage.getItem("BYPASS_ROLE") || "mentor";
  
  const currentRole = bypassAuth ? testRole : userRole;
  const isAuthenticated = bypassAuth || isAuthenticatedCtx;
  
console.log("RoleRoute: currentRole =", currentRole, "isAuthenticated =", isAuthenticated, "allowedRoles =", allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;