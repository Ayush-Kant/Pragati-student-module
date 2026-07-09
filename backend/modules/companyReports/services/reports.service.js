import * as reportsRepository from "../repositories/reports.repository.js";

export const getDashboardAnalytics = async (companyId) => {
  return reportsRepository.getDashboardAnalytics(companyId);
};

export const getConversionAnalytics = async (companyId) => {
  return reportsRepository.getConversionAnalytics(companyId);
};

export const getOfferAnalytics = async (companyId) => {
  return reportsRepository.getOfferAnalytics(companyId);
};

export const getCollegePerformance = async (companyId) => {
  return reportsRepository.getCollegePerformance(companyId);
};

export const getSkillGapAnalytics = async () => {
  return reportsRepository.getSkillGapAnalytics();
};

export const getHiringTrends = async (companyId) => {
  return reportsRepository.getHiringTrends(companyId);
};
