import api from "../../../../services/api";

// Get statistics
export const getDepartmentStatistics = async () => {
  const response = await api.get("/departments/statistics");
  return response.data;
};

// Update statistics
export const updateDepartmentStatistics = async (statisticsData) => {
  const response = await api.put(
    "/departments/statistics",
    statisticsData
  );

  return response.data;
};

export default {
  getDepartmentStatistics,
  updateDepartmentStatistics,
};