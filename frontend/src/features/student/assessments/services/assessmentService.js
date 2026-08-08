import { dummyAssessments, dummyHistory } from "../types/assessmentDummyData";

export const getAssessments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyAssessments), 300);
  });
};

export const getAssessmentById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = dummyAssessments.find((a) => a.id === id);
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

  assessment.questions.forEach((q, idx) => {
    if (answers[idx] === q.correctOption) {
      score += 10;
    }
  });

  const percentage = Math.round((score / assessment.totalMarks) * 100);
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
      const found = dummyHistory.find((item) => item.attemptId === attemptId);
      if (found) {
        resolve(found);
      } else if (dummyHistory.length > 0) {
        resolve(dummyHistory[0]);
      } else {
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