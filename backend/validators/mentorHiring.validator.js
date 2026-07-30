export const validateHiringRelevant = (req, res, next) => {
  const { hiringRelevant } = req.body;
  if (typeof hiringRelevant !== "boolean")
    return res.status(400).json({ success: false, message: "hiringRelevant must be a boolean" });
  next();
};

export const validateDriveSkills = (req, res, next) => {
  const { requiredSkills } = req.body;
  if (!Array.isArray(requiredSkills) || requiredSkills.some((s) => typeof s !== "string"))
    return res.status(400).json({ success: false, message: "requiredSkills must be an array of strings" });
  next();
};

export const validateReadinessThreshold = (req, res, next) => {
  const { minimumReadinessScore } = req.body;
  const score = Number(minimumReadinessScore);
  if (isNaN(score) || score < 0 || score > 100)
    return res.status(400).json({ success: false, message: "minimumReadinessScore must be a number between 0 and 100" });
  next();
};

export const validateShortlist = (req, res, next) => {
  const { shortlisted } = req.body;
  if (typeof shortlisted !== "boolean")
    return res.status(400).json({ success: false, message: "shortlisted must be a boolean" });
  next();
};

export const validateRecommendation = (req, res, next) => {
  const { recommendation } = req.body;
  if (!recommendation || typeof recommendation !== "string" || !recommendation.trim())
    return res.status(400).json({ success: false, message: "recommendation must be a non-empty string" });
  next();
};
