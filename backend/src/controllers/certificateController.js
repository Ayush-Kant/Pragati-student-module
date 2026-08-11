import CertificateService from '../services/certificateService.js';

const certificateService = new CertificateService();

export const getCertificates = async (req, res, next) => {
  try {
    const response = await certificateService.getCertificates(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCertificateById = async (req, res, next) => {
  try {
    const response = await certificateService.getCertificateById(req.user, req.params.certificateId);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const generateCertificate = async (req, res, next) => {
  try {
    const response = await certificateService.generateCertificate(req.user, req.body);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const response = await certificateService.verifyCertificate(req.user, req.params.certificateId, req.query);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAchievements = async (req, res, next) => {
  try {
    const response = await certificateService.getAchievements(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getBadges = async (req, res, next) => {
  try {
    const response = await certificateService.getBadges(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCertificateStatistics = async (req, res, next) => {
  try {
    const response = await certificateService.getCertificateStatistics(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAchievementSummary = async (req, res, next) => {
  try {
    const response = await certificateService.getAchievementSummary(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getBadgeCount = async (req, res, next) => {
  try {
    const response = await certificateService.getBadgeCount(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCompletionInsights = async (req, res, next) => {
  try {
    const response = await certificateService.getCompletionInsights(req.user);
    return res.status(response.statusCode || 200).json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  getCertificates,
  getCertificateById,
  generateCertificate,
  verifyCertificate,
  getAchievements,
  getBadges,
  getCertificateStatistics,
  getAchievementSummary,
  getBadgeCount,
  getCompletionInsights,
};
