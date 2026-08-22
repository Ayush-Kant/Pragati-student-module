import { dummyAssessments, dummyHistory } from "../types/assessmentDummyData";

export const getAssessments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyAssessments), 300);
  });
};

export const getAssessmentById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Safe stringified ID comparison
      const found = dummyAssessments.find((a) => String(a.id) === String(id));
      if (found) resolve(found);
      else reject(new Error("Assessment not found"));
    }, 300);
  });
};

export const startAssessment = async (id) => {
  return getAssessmentById(id);
};

export const submitAssessment = async (id, answers) => {
  const assessment = await getAssessmentById(id);
  let score = 0;

  const defaultWeight =
    assessment.questions?.length > 0
      ? assessment.totalMarks / assessment.questions.length
      : 0;

  assessment.questions?.forEach((q, idx) => {
    if (answers[idx] === q.correctOption) {
      score += q.marks || defaultWeight;
    }
  });

  const percentage = assessment.totalMarks
    ? Math.round((score / assessment.totalMarks) * 100)
    : 0;

  const result = {
    attemptId: `att-${Date.now()}`,
    assessmentId: id,
    title: assessment.title,
    score,
    totalMarks: assessment.totalMarks,
    percentage,
    status: score >= assessment.passingMarks ? "passed" : "failed",
    submittedAt: new Date().toISOString(),
    timeSpentMinutes: assessment.durationMinutes || 15,
    answers,
    questions: assessment.questions
  };

  dummyHistory.unshift(result);
  return result;
};

export const getAssessmentResult = async (attemptId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = dummyHistory.find(
        (item) => String(item.attemptId) === String(attemptId)
      );
      if (found) {
        resolve(found);
      } else {
        // Explicitly throw error when attemptId is not found
        reject(new Error("Result not found"));
      }
    }, 300);
  });
};

export const getAssessmentHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyHistory), 300);
  });
};