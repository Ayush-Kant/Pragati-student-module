import api from "../../../../services/api";
import { API_ENDPOINTS } from "../constants/analyticsConstants";

export const getDashboardAnalytics = async () => {
  const { data } = await api.get(API_ENDPOINTS.DASHBOARD);
  return data;
};

export const getOverviewStatistics = async () => {
  const { data } = await api.get(API_ENDPOINTS.OVERVIEW);
  return data;
};

export const getPlacementAnalytics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.PLACEMENTS, { params });
  return data;
};

export const getPlacementTrends = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.PLACEMENT_TRENDS, { params });
  return data;
};

export const getCompanyAnalytics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.COMPANIES, { params });
  return data;
};

export const getDepartmentAnalytics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.DEPARTMENTS, { params });
  return data;
};

export const getStudentAnalytics = async (params = {}) => {
  const { data } = await api.get(API_ENDPOINTS.STUDENTS, { params });
  return data;
};

export const exportAnalytics = async (format, reportType = "dashboard") => {
  const endpoint = format === "pdf" ? API_ENDPOINTS.EXPORT_PDF : API_ENDPOINTS.EXPORT_EXCEL;
  const { data } = await api.get(endpoint, { params: { reportType }, responseType: "blob" });
  return data;
};
