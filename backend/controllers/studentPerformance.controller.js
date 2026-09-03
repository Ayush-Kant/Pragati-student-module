import studentPerformanceService from '../services/studentPerformance.service.js';

export const getPerformance = async (req, res, next) => {
  try {
    const data = await studentPerformanceService.getPerformance(req.user);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export default { getPerformance };
