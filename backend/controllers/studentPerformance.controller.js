import studentPerformanceService from '../services/studentPerformance.service.js';

export const getPerformance = async (req, res, next) => {
  try {
    const data = await studentPerformanceService.getPerformance(req.user, req.params.driveId || null);
    return res.status(200).json({ success: true, performance: data, data });
  } catch (error) {
    return next(error);
  }
};

export const getSubmissionHistory = async (req, res, next) => {
  try {
    const data = await studentPerformanceService.getSubmissionHistory(req.user, req.query);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};

export default { getPerformance, getSubmissionHistory };
