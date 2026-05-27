import React, { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const mockAuthState = {
    student: {
      studentId: "uuid-001",
      fullName: "Ritika Sharma",
      email: "ritika@example.com",
    },
    accessToken: "eyJhbGciOiJIUzI1NiIs...",
    isAuthenticated: true,
    login: () => {},
    logout: () => {},
  };

  return (
    <AuthContext.Provider value={mockAuthState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
