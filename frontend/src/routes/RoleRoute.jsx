import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { userRole, isAuthenticated } = useAuth();
console.log("RoleRoute: userRole =", userRole, "isAuthenticated =", isAuthenticated, "allowedRoles =", allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;