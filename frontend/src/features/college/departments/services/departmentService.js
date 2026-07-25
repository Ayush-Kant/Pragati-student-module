import api from "../../../../services/api";

// =======================
// Department APIs
// =======================

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const getDepartment = async (id) => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

export const addDepartment = async (departmentData) => {
  const response = await api.post("/departments", departmentData);
  return response.data;
};

export const updateDepartment = async (id, departmentData) => {
  const response = await api.put(`/departments/${id}`, departmentData);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};

export const searchDepartments = async (query) => {
  const response = await api.get(`/departments/search?q=${query}`);
  return response.data;
};

// =======================
// Course APIs
// =======================

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const addCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

export const getDepartmentCourses = async (departmentId) => {
  const response = await api.get(`/departments/${departmentId}/courses`);
  return response.data;
};