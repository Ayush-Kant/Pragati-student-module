import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logoutStudentApi, refreshStudentApi } from "../features/auth/services/studentAuth.services";
import { firebaseAuth } from "../firebase/studentFirebaseAuth";
import { refreshStudentAccessToken } from "../services/api";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  return Boolean(decoded?.exp && Date.now() < decoded.exp * 1000);
};

const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded) {
    return {
      name: decoded.name || decoded.fullName || decoded.username || "Student",
      email: decoded.email || "candidate@pragati.com",
      role: decoded.role ?? null,
      id: decoded.id || decoded.userId || decoded.sub || null,
      studentId: decoded.studentId || null,
      firebaseUid: decoded.firebaseUid || null,
    };
  }

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const isFirebaseStudentToken = (jwtToken) => Boolean(decodeToken(jwtToken)?.firebaseUid);

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

  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("student_session")));

  useEffect(() => {
    const handleRefresh = (event) => {
      const nextToken = event.detail?.accessToken;
      if (!nextToken || !isTokenValid(nextToken)) return;
      setToken(nextToken);
      setUserRole("student");
      setUser(getUserFromToken(nextToken));
      setLoading(false);
    };

    const handleExpired = () => {
      setToken(null);
      setUserRole(null);
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("student-auth-refreshed", handleRefresh);
    window.addEventListener("student-auth-expired", handleExpired);

    return () => {
      window.removeEventListener("student-auth-refreshed", handleRefresh);
      window.removeEventListener("student-auth-expired", handleExpired);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("student_session")) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    refreshStudentApi()
      .then((session) => {
        if (!mounted || !session?.accessToken) return;
        localStorage.setItem("token", session.accessToken);
        setToken(session.accessToken);
        setUserRole("student");
        setUser(getUserFromToken(session.accessToken));
      })
      .catch(() => {
        if (!mounted) return;
        localStorage.removeItem("token");
        localStorage.removeItem("student_session");
        setToken(null);
        setUserRole(null);
        setUser(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const login = (role, jwtToken) => {
    if (!role || !jwtToken) return;

    localStorage.setItem("token", jwtToken);
    if (role === "student" && isFirebaseStudentToken(jwtToken)) {
      localStorage.setItem("student_session", "1");
    } else if (role !== "student") {
      localStorage.removeItem("student_session");
    }

    const nextUser = getUserFromToken(jwtToken);
    setToken(jwtToken);
    setUserRole(role);
    setUser(nextUser);
    setLoading(false);
  };

  const logout = async () => {
    if (userRole === "student" && isFirebaseStudentToken(token)) {
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
    localStorage.removeItem("student_session");
    sessionStorage.removeItem("token");

    document.cookie.split(";").forEach((c) => {
      const cookieName = c.split("=")[0].trim();
      if (cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    setToken(null);
    setUserRole(null);
    setUser(null);
    setLoading(false);
  };

  // Keep the context state synchronized when the API interceptor refreshes a token.
  // `refreshStudentAccessToken` is imported here so this module owns the same
  // refresh implementation used for automatic 401 recovery.
  void refreshStudentAccessToken;

  return (
    <AuthContext.Provider value={{ user, userRole, token, loading, setLoading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
