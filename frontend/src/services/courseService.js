import apiClient from "./api.js";

export const courseService = {
  // GET all courses (automatically attaches Bearer <token>)
  getCourses: async (filters = {}) => {
    const response = await apiClient.get("/mentor/courses", {
      params: filters,
    });
    return response.data;
  },

  // POST create course
  createCourse: async (courseData) => {
    const payload = {
      title: courseData.title,
      description: courseData.shortDescription || courseData.description,
      skillTags: courseData.skillTags,
      driveId: courseData.driveId,
    };
    const response = await apiClient.post("/mentor/courses", payload);
    return response.data;
  },

  // GET single course with modules
  getCourseById: async (courseId) => {
    const response = await apiClient.get(`/mentor/courses/${courseId}`);
    return response.data;
  },

  // PATCH update course
  updateCourse: async (courseId, updateData) => {
    const response = await apiClient.patch(
      `/api/mentor/courses/${courseId}`,
      updateData,
    );
    return response.data;
  },

  // DELETE (archive) course
  archiveCourse: async (courseId) => {
    const response = await apiClient.delete(`/mentor/courses/${courseId}`);
    return response.data;
  },
};
