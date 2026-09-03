import api from "../../../services/api";

export const registerStudentApi = async ({ email, password, fullName, collegeId }) => {
  const response = await api.post("/auth/student/register", {
    email,
    password,
    fullName,
    collegeId,
  });
  return response.data;
};

export const loginStudentApi = async (idToken) => {
  const response = await api.post(
    "/auth/student/login",
    { idToken },
    { withCredentials: true },
  );
  return response.data;
};

export const googleStudentApi = async (idToken, collegeId) => {
  const response = await api.post(
    "/auth/student/google",
    { idToken, collegeId: collegeId || undefined },
    { withCredentials: true },
  );
  return response.data;
};

export const refreshStudentApi = async () => {
  const response = await api.post(
    "/auth/student/refresh",
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const logoutStudentApi = async () => {
  const response = await api.post(
    "/auth/student/logout",
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const saveOnboardingStepApi = async (stepNumber, payload) => {
  const isFormData = payload instanceof FormData;
  const response = await api.put(
    `/student/onboarding/step/${stepNumber}`,
    payload,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
  return response.data;
};

export const getOnboardingStateApi = async () => {
  const response = await api.get("/student/onboarding");
  return response.data;
};
