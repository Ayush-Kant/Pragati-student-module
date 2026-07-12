export const validateCreateChallenge = (req, res, next) => {
  const { title, description, maxScore, allowedLanguages } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ success: false, message: "Title must be at least 3 characters" });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: "Description is required" });
  }
  if (!maxScore || Number(maxScore) <= 0) {
    return res.status(400).json({ success: false, message: "maxScore must be a positive number" });
  }
  if (!Array.isArray(allowedLanguages) || allowedLanguages.length === 0) {
    return res.status(400).json({ success: false, message: "At least one allowed language is required" });
  }
  for (const lang of allowedLanguages) {
    if (!lang.languageId || !lang.languageName) {
      return res.status(400).json({ success: false, message: "Each language must have languageId and languageName" });
    }
  }
  next();
};

export const validateAddTestCases = (req, res, next) => {
  const { testCases } = req.body;

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ success: false, message: "testCases must be a non-empty array" });
  }

  let totalWeight = 0;
  for (const tc of testCases) {
    if (!tc.input || !tc.expectedOutput) {
      return res.status(400).json({ success: false, message: "Each test case must have input and expectedOutput" });
    }
    if (typeof tc.weightPct !== "number" || tc.weightPct < 0) {
      return res.status(400).json({ success: false, message: "Each test case must have a valid weightPct" });
    }
    totalWeight += tc.weightPct;
  }
  if (Math.round(totalWeight) !== 100) {
    return res.status(400).json({ success: false, message: "Total weightPct of all test cases must equal 100" });
  }
  next();
};

export const validateSubmitCode = (req, res, next) => {
  const { languageId, sourceCode } = req.body;

  if (!languageId || typeof languageId !== "number") {
    return res.status(400).json({ success: false, message: "languageId is required and must be a number" });
  }
  if (!sourceCode || !sourceCode.trim()) {
    return res.status(400).json({ success: false, message: "sourceCode is required" });
  }
  next();
};
