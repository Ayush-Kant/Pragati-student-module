import deadlineService from "../services/deadlineService.js";

export const getDeadlines = async (req, res, next) => {
  try {
    const deadlines = await deadlineService.getDeadlines(req.validatedQuery || req.query, req.user);
    res.status(200).json({ success: true, data: deadlines });
  } catch (error) {
    next(error);
  }
};

export const updateDeadline = async (req, res, next) => {
  try {
    const deadline = await deadlineService.updateDeadline(req.validatedParams?.id || req.params.id, req.validatedBody || req.body, req.user);
    res.status(200).json({ success: true, message: "Deadline updated successfully", data: deadline });
  } catch (error) {
    next(error);
  }
};

export default { getDeadlines, updateDeadline };
