export const validateGrade = (req, res, next) => {
  const { score, remarks } = req.body;

  if (score === undefined || score === null) {
    return res.status(400).json({
      success: false,
      message: "score is required",
    });
  }

  if (Number(score) < 0) {
    return res.status(400).json({
      success: false,
      message: "score must be greater than or equal to 0",
    });
  }

  req.body.remarks = req.body.remarks?.trim?.() || null;
  next();
};

export default {
  validateGrade,
};
