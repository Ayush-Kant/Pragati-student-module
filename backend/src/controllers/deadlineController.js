import deadlineService from "../services/deadlineService.js";

export const getDeadlines = async (req, res, next) => {
  try {
    const deadlines = await deadlineService.getDeadlines(req.query);
    res.status(200).json({ success: true, data: deadlines });
  } catch (error) {
    next(error);
  }
};

export const updateDeadline = async (req, res, next) => {
  try {
    const deadline = await deadlineService.updateDeadline(req.params.id, req.validatedBody || req.body);
    res.status(200).json({ success: true, message: "Deadline updated successfully", data: deadline });
  } catch (error) {
    next(error);
  }
};

export default { getDeadlines, updateDeadline };
