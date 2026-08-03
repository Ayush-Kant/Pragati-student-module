import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  const getRedirectPath = (role) => (role === 'admin' ? '/admin' : `/${role}/dashboard`);

  useEffect(() => {
    if (isAuthenticated && userRole) {
      navigate(getRedirectPath(userRole), { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  return null;
};

export default NotFoundPage;