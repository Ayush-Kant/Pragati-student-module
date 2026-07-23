import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  const getRedirectPath = (role) => (role === 'admin' ? '/admin' : `/${role}/dashboard`);

  const handleRedirect = () => {
    if (isAuthenticated && userRole) {
      navigate(getRedirectPath(userRole), { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-8xl font-black text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">Page not found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <button
        onClick={handleRedirect}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        {isAuthenticated ? "Back to Dashboard" : "Go to Login"}
      </button>
    </div>
  );
};

export default NotFoundPage;