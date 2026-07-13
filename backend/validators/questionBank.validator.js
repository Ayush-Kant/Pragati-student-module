const VALID_TYPES = [
  "mcq",
  "multi_select",
  "true_false",
  "fill_blank",
  "match_following",
];
const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

export const validateCreateQuestion = (req, res, next) => {
  const { type, difficulty, body, options, correct, timeLimitSec, tags } =
    req.body;

  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid question type. Must be one of: ${VALID_TYPES.join(", ")}`,
    });
  }

  if (difficulty !== undefined && !VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
    });
  }

  if (!body || typeof body !== "string" || !body.trim()) {
    return res.status(400).json({
      success: false,
      message: "Question body is required and must be a non-empty string",
    });
  }

  if (
    options !== undefined &&
    options !== null &&
    !Array.isArray(options) &&
    typeof options !== "object"
  ) {
    return res.status(400).json({
      success: false,
      message: "Options must be an array or an object",
    });
  }

  if (correct === undefined || correct === null) {
    return res.status(400).json({
      success: false,
      message: "Correct answer(s) must be specified",
    });
  }

  if (
    timeLimitSec !== undefined &&
    timeLimitSec !== null &&
    (typeof timeLimitSec !== "number" ||
      timeLimitSec <= 0 ||
      !Number.isInteger(timeLimitSec))
  ) {
    return res.status(400).json({
      success: false,
      message: "timeLimitSec must be a positive integer",
    });
  }

  if (tags !== undefined && tags !== null && !Array.isArray(tags)) {
    return res.status(400).json({
      success: false,
      message: "Tags must be an array of strings",
    });
  }

  next();
};

export const validateUpdateQuestion = (req, res, next) => {
  const { type, difficulty, body, options, correct, timeLimitSec, tags } =
    req.body;

  if (type !== undefined && !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid question type. Must be one of: ${VALID_TYPES.join(", ")}`,
    });
  }

  if (difficulty !== undefined && !VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      success: false,
      message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
    });
  }

  if (body !== undefined && (typeof body !== "string" || !body.trim())) {
    return res.status(400).json({
      success: false,
      message: "Question body must be a non-empty string",
    });
  }

  if (
    options !== undefined &&
    options !== null &&
    !Array.isArray(options) &&
    typeof options !== "object"
  ) {
    return res.status(400).json({
      success: false,
      message: "Options must be an array or an object",
    });
  }

  if (
    timeLimitSec !== undefined &&
    timeLimitSec !== null &&
    (typeof timeLimitSec !== "number" ||
      timeLimitSec <= 0 ||
      !Number.isInteger(timeLimitSec))
  ) {
    return res.status(400).json({
      success: false,
      message: "timeLimitSec must be a positive integer",
    });
  }

  if (tags !== undefined && tags !== null && !Array.isArray(tags)) {
    return res.status(400).json({
      success: false,
      message: "Tags must be an array of strings",
    });
  }

  next();
};

export const validateGenerateQuiz = (req, res, next) => {
  const {
    skillTags,
    difficulty,
    questionCount,
    randomizeOrder,
    randomizeOptions,
  } = req.body;

  if (
    skillTags !== undefined &&
    skillTags !== null &&
    !Array.isArray(skillTags)
  ) {
    return res.status(400).json({
      success: false,
      message: "skillTags must be an array of strings",
    });
  }

  if (
    difficulty !== undefined &&
    difficulty !== null &&
    !VALID_DIFFICULTIES.includes(difficulty)
  ) {
    return res.status(400).json({
      success: false,
      message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
    });
  }

  if (
    questionCount !== undefined &&
    questionCount !== null &&
    (typeof questionCount !== "number" ||
      questionCount <= 0 ||
      !Number.isInteger(questionCount))
  ) {
    return res.status(400).json({
      success: false,
      message: "questionCount must be a positive integer",
    });
  }

  if (
    randomizeOrder !== undefined &&
    randomizeOrder !== null &&
    typeof randomizeOrder !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: "randomizeOrder must be a boolean",
    });
  }

  if (
    randomizeOptions !== undefined &&
    randomizeOptions !== null &&
    typeof randomizeOptions !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: "randomizeOptions must be a boolean",
    });
  }

  next();
};
