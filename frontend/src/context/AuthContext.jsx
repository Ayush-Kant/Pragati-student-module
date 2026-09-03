import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logoutStudentApi } from "../features/auth/services/studentAuth.services";
import { firebaseAuth } from "../firebase/studentFirebaseAuth";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      name: decoded.name || decoded.fullName || decoded.username || "Student",
      email: decoded.email || "candidate@pragati.com",
      role: decoded.role ?? null,
      id: decoded.id || decoded.userId || decoded.sub || null,
      studentId: decoded.studentId || null,
    };
  } catch {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
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
    return stored && isTokenValid(stored) ? getUserFromToken(stored)?.role : null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored && isTokenValid(stored) ? getUserFromToken(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = (role, jwtToken) => {
    if (!role || !jwtToken) return;
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setUserRole(role);
    setUser(getUserFromToken(jwtToken));
  };

  const logout = async () => {
    if (userRole === "student") {
      try {
        await logoutStudentApi();
      } catch (error) {
        console.warn("Student session logout request failed:", error?.message || error);
      }
      try {
        await signOut(firebaseAuth);
      } catch (error) {
        console.warn("Firebase sign-out failed:", error?.message || error);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");

    // Legacy applications may still set readable cookies; remove them client-side.
    document.cookie.split(";").forEach((c) => {
      const cookieName = c.split("=")[0].trim();
      if (cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    setToken(null);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
