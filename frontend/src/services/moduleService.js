import api from "./api.js";

export const moduleService = {
  // POST add module
  addModule: async (courseId, title, orderIndex) => {
    const response = await apiClient.post(
      `/mentor/courses/${courseId}/modules`,
      { title, orderIndex },
    );
    return response.data;
  },

  // DELETE module
  deleteModule: async (moduleId) => {
    const response = await apiClient.delete(`/mentor/modules/${moduleId}`);
    return response.data;
  },

  // PUT reorder lessons inside module
  reorderLessons: async (moduleId, lessonOrder) => {
    const response = await apiClient.put(
      `/mentor/modules/${moduleId}/reorder`,
      { lessonOrder },
    );
    return response.data;
  },
};
