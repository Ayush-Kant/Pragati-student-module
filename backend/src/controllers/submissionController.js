import submissionService from "../services/submissionService.js";

export const submitAssignment = async (req, res, next) => {
  try {
    const submission = await submissionService.submitAssignment(req.user.id, req.validatedParams?.id || req.params.id, req.validatedBody || req.body);
    res.status(201).json({ success: true, message: "Assignment submitted successfully", data: submission });
  } catch (error) {
    next(error);
  }
};

export const updateSubmission = async (req, res, next) => {
  try {
    const submission = await submissionService.updateSubmission(req.user.id, req.validatedParams?.id || req.params.id, req.validatedBody || req.body);
    res.status(200).json({ success: true, message: "Submission updated successfully", data: submission });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionHistory = async (req, res, next) => {
  try {
    const history = await submissionService.getSubmissionHistory(req.user.id, req.validatedParams?.id || req.params.id);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export default { submitAssignment, updateSubmission, getSubmissionHistory };
