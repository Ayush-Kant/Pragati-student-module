import axios from "axios";

const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const API_URL = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const isStudentAuthEndpoint = (url = "") =>
  /\/auth\/student\/(refresh|login|register|google|logout)(?:\/|\?|$)/.test(String(url));

let studentRefreshPromise = null;

export const refreshStudentAccessToken = async () => {
  if (!studentRefreshPromise) {
    studentRefreshPromise = axios
      .post(`${API_URL}/auth/student/refresh`, {}, { withCredentials: true })
      .then((response) => {
        const accessToken = response.data?.accessToken;
        if (!accessToken) {
          throw new Error("Student session refresh returned no access token");
        }

        localStorage.setItem("token", accessToken);
        window.dispatchEvent(new CustomEvent("student-auth-refreshed", { detail: { accessToken } }));
        return accessToken;
      })
      .finally(() => {
        studentRefreshPromise = null;
      });
  }

  return studentRefreshPromise;
};

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const studentSession = localStorage.getItem("student_session");

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._studentAuthRetry ||
      !studentSession ||
      isStudentAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._studentAuthRetry = true;

    try {
      const accessToken = await refreshStudentAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("token");
      localStorage.removeItem("student_session");
      sessionStorage.removeItem("token");
      window.dispatchEvent(new Event("student-auth-expired"));
      return Promise.reject(refreshError);
    }
  },
);

export default api;
