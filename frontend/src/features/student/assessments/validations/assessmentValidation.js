export const validateAssessmentPayload = (assessment) => {
  if (!assessment || typeof assessment !== "object") return false;
  if (!assessment.id || !assessment.title || !Array.isArray(assessment.questions)) {
    return false;
  }
  return true;
};export const validateAssessmentPayload = (assessment) => {
  if (!assessment || typeof assessment !== "object") return false;
  if (!assessment.id || !assessment.title || !Array.isArray(assessment.questions)) {
    return false;
  }

  // Deep validation of individual question elements
  for (const q of assessment.questions) {
    if (!q || typeof q !== "object") return false;
    if (!q.id || typeof q.text !== "string" || !q.text.trim()) return false;
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    if (typeof q.correctOption !== "number" || q.correctOption < 0 || q.correctOption >= q.options.length) {
      return false;
    }
  }

  return true;
};