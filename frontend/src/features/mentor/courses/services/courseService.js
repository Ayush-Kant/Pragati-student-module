import api from "../../../../../services/api";

const mockData = {
  courseId: "mock-999",
  title: "Advanced Full-Stack Web Development",
  shortDescription: "Master the art of building scalable enterprise applications.",
  fullDescription: "<h2>Course Description</h2><p>Learn to architect systems...</p>",
  category: "tech",
  subcategory: "backend",
  level: "Intermediate",
  language: "English",
  estimatedDuration: "40 Hours",
  skillTags: ["React", "Node.js", "MongoDB", "TypeScript"],
  visibility: "Published",
  pricingModel: "Paid",
  currency: "INR",
  basePrice: "1249",
  discountType: "Percentage",
  discountValue: "20",
  modules: [
    {
      id: "sec-1",
      title: "Module 1: Frontend Foundations",
      status: "Published",
      duration: "1h 20m",
      lectures: [
        { id: "lec-1", title: "Advanced Component Lifecycle", type: "Video", duration: "20:15" }
      ]
    }
  ]
};

export const getCourseDetails = async (courseId) => {
  try {
    const response = await api.get(`/v1/courses/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.warn("API failed, falling back to mock data", error);
    if (error.response?.status === 401) {
      throw error; // Let the hook redirect to login
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 1000);
    });
  }
};

export const updateCourseDetails = async (courseId, updateData) => {
  try {
    const response = await api.put(`/v1/courses/${courseId}`, updateData);
    return response.data;
  } catch (error) {
    console.warn("API failed, simulating success with mock", error);
    if (error.response?.status === 401) {
      throw error;
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, data: { ...mockData, ...updateData } }), 1000);
    });
  }
};
