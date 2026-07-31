import api from "../../../services/api";
import { mockCompanies, mockActiveDrives, mockRankings } from "../adminCompanyMockData";

const normalizeCompany = (company) => {
  if (!company) return null;
  return {
    ...company,
    // id: Number(company.id),
    id: Number(company.id ?? company.companyId),
    status: company.status || "Pending",
    activityLogs: company.activityLogs || [],
    activeDrives: company.activeDrives || [],
  };
};

const normalizeCompanies = (companies) => {
  return Array.isArray(companies)
    ? companies.map(normalizeCompany)
    : [];
};

const fallbackGetCompanyById = (id) => {
  return normalizeCompany(
    mockCompanies.find((company) => company.id === Number(id))
  );
};

const applyMockStatusUpdate = (companyId, payload) => {
  const company = mockCompanies.find((c) => c.id === Number(companyId));
  if (!company) return null;

  company.status = payload.status;
  if (!company.activityLogs) {
    company.activityLogs = [];
  }

  company.activityLogs.unshift({
    id: Date.now(),
    action: `Company ${payload.status.charAt(0).toUpperCase() + payload.status.slice(1)}`,
    actor: "Admin",
    reason: payload.reason || "",
    timestamp: new Date().toLocaleString(),
  });

  return normalizeCompany(company);
};

export const getCompanies = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.industry) params.append("industry", filters.industry);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const queryString = params.toString();
    // const url = queryString ? `/companies?${queryString}` : "/companies";
    const url = queryString
      ? `/v1/admin/company?${queryString}`
      : "/v1/admin/company";

    const response = await api.get(url);
    const companies = response.data?.companies ?? response.data ?? [];
    return normalizeCompanies(companies);
  } catch (error) {
    console.warn("Company API unavailable, using mock data", error?.message);
    return normalizeCompanies(mockCompanies);
  }
};

export const getCompanyById = async (id) => {
  try {
    // const response = await api.get(`/companies/${id}`);
    const response = await api.get(`/v1/admin/company/${id}`);
    const company = response.data?.company ?? response.data;
    return normalizeCompany(company) ?? fallbackGetCompanyById(id);
  } catch (error) {
    console.warn("Company detail API unavailable, using mock data", error?.message);
    return fallbackGetCompanyById(id);
  }
};

export const updateCompanyStatus = async (companyId, payload) => {
  try {
    const response = await api.patch(`/companies/${companyId}`, payload);
    const company = response.data?.company ?? response.data;
    return normalizeCompany(company) ?? applyMockStatusUpdate(companyId, payload);
  } catch (error) {
    console.warn("Company status API unavailable, using mock update", error?.message);
    return applyMockStatusUpdate(companyId, payload);
  }
};

export const getCompanyStats = async (id) => {
  try {
    // const response = await api.get(`/companies/${id}/stats`);
    const response = await api.get(`/v1/admin/company/${id}/stats`);
    return response.data ?? {};
  } catch (error) {
    console.warn(`Company stats API unavailable for ID ${id}`, error?.message);
    return {};
  }
};

export const getCompanyDrives = async (id) => {
  try {
    // const response = await api.get(`/companies/${id}/drives`);
    const response = await api.get(`/v1/admin/company/${id}/drives`);
    const drives = response.data?.drives ?? response.data ?? [];
    return Array.isArray(drives) ? drives : [];
  } catch (error) {
    console.warn(`Company drives API unavailable for ID ${id}`, error?.message);
    return [];
  }
};

export const getActiveDrives = async () => {
  try {
    // const response = await api.get("/companies/active-drives");
    const response = await api.get("/v1/admin/company/active-drives")
    return response.data?.drives ?? response.data ?? mockActiveDrives;
  } catch (error) {
    console.warn("Active drives API unavailable, using mock data", error?.message);
    return mockActiveDrives;
  }
};

export const getCompanyRankings = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.limit) params.append("limit", filters.limit);
    if (filters.sort) params.append("sort", filters.sort);

    const queryString = params.toString();
    // const url = queryString ? `/companies/rankings?${queryString}` : "/companies/rankings";
    const url = queryString
      ? `/v1/admin/company/rankings?${queryString}`
      : "/v1/admin/company/rankings";

    const response = await api.get(url);
    return response.data?.rankings ?? response.data ?? mockRankings;
  } catch (error) {
    console.warn("Company rankings API unavailable, using mock data", error?.message);
    return mockRankings;
  }
};