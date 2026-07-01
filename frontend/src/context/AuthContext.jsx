import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const getRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.role ?? null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    if (stored && isTokenValid(stored)) return stored;
    if (stored) localStorage.removeItem("token");
    return null;
  });

  const [userRole, setUserRole] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored && isTokenValid(stored) ? getRoleFromToken(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = (userRole, jwtToken) => {
    if (!userRole || !jwtToken) return;
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setUserRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        token,
        loading,
        setLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
