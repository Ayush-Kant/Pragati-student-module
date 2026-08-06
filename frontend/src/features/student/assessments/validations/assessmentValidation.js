export const validateAssessmentPayload = (assessment) => {
  if (!assessment || typeof assessment !== "object") return false;
  if (!assessment.id || !assessment.title || !Array.isArray(assessment.questions)) {
    return false;
  }
  return true;
};