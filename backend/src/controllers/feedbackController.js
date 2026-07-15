import feedbackService from "../services/feedbackService.js";

export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedback(req.params.id);
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

export const addFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.addFeedback(req.params.id, req.validatedBody || req.body);
    res.status(201).json({ success: true, message: "Feedback added successfully", data: feedback });
  } catch (error) {
    next(error);
  }
};

export default { getFeedback, addFeedback };
