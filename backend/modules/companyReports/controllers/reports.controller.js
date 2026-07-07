import * as reportsService from "../services/reports.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await reportsService.getDashboardAnalytics(companyId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversion = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await reportsService.getConversionAnalytics(companyId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOfferAnalytics = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await reportsService.getOfferAnalytics(companyId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCollegePerformance = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await reportsService.getCollegePerformance(companyId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillGap = async (req, res, next) => {
  try {
    const data = await reportsService.getSkillGapAnalytics();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getHiringTrends = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await reportsService.getHiringTrends(companyId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
