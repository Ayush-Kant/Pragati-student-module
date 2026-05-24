// AuthContext.jsx
// Purpose: Manages JWT-based student session state and auth methods via React Context

import React, { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const value = {
    student: null,
    accessToken: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
