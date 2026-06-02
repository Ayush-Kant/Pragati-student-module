// API base URL (change if backend URL differs)
export const API_BASE_URL = "http://localhost:8080/api";

// Common regex patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
};

// App constants
export const APP_NAME = "Pragati";
export const TOKEN_KEY = "auth_token";

// Status constants (if used in UI)
export const STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};