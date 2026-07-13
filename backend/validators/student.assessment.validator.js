const validateAssessmentSubmission = (req, res, next) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: "answers must be an array." });
  }

  for (const answer of answers) {
    if (!answer || typeof answer !== "object") {
      return res.status(400).json({ error: "Each answer must be an object." });
    }

    if (!answer.question_id) {
      return res.status(400).json({ error: "Each answer must include question_id." });
    }
  }

  next();
};

export { validateAssessmentSubmission };
export default validateAssessmentSubmission;
