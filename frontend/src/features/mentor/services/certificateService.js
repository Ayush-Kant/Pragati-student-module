import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// =============================
// Request Interceptor
// =============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// Response Interceptor
// =============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// =============================
// Template APIs
// =============================

export const getCertificateTemplate = async () => {
  const response = await API.get("/certificates/template");
  return response.data;
};

export const saveCertificateTemplate = async (data) => {
  const response = await API.post("/certificates/template", data);
  return response.data;
};

export const updateCertificateTemplate = async (id, data) => {
  const response = await API.put(`/certificates/template/${id}`, data);
  return response.data;
};

// =============================
// Upload APIs
// =============================

export const uploadLogo = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);

  const response = await API.post(
    "/upload/logo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const uploadSignature = async (file) => {
  const formData = new FormData();
  formData.append("signature", file);

  const response = await API.post(
    "/upload/signature",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =============================
// Skills
// =============================

export const getSkillSuggestions = async (query = "") => {
  const response = await API.get("/skills", {
    params: { search: query },
  });

  return response.data;
};

export default API;