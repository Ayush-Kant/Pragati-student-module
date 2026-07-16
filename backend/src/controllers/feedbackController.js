import feedbackService from "../services/feedbackService.js";

export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedback(req.validatedParams?.id || req.params.id, req.user);
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

export const addFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.addFeedback(req.validatedParams?.id || req.params.id, req.validatedBody || req.body, req.user);
    res.status(201).json({ success: true, message: "Feedback added successfully", data: feedback });
  } catch (error) {
    next(error);
  }
};

export default { getFeedback, addFeedback };
