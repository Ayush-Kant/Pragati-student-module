import Assessment from "./assessmentModel.js";
import AssessmentQuestion from "./assessmentQuestionModel.js";
import AssessmentAttempt from "./assessmentAttemptModel.js";
import AssessmentAnswer from "./assessmentAnswerModel.js";
import AssessmentResult from "./assessmentResultModel.js";

Assessment.hasMany(AssessmentQuestion, { foreignKey: "assessmentId", as: "questions" });
AssessmentQuestion.belongsTo(Assessment, { foreignKey: "assessmentId", as: "assessment" });

Assessment.hasMany(AssessmentAttempt, { foreignKey: "assessmentId", as: "attempts" });
AssessmentAttempt.belongsTo(Assessment, { foreignKey: "assessmentId", as: "assessment" });

AssessmentAttempt.hasMany(AssessmentAnswer, { foreignKey: "attemptId", as: "answers" });
AssessmentAnswer.belongsTo(AssessmentAttempt, { foreignKey: "attemptId", as: "attempt" });

AssessmentAnswer.belongsTo(AssessmentQuestion, { foreignKey: "questionId", as: "question" });
AssessmentQuestion.hasMany(AssessmentAnswer, { foreignKey: "questionId", as: "answers" });

AssessmentAttempt.hasOne(AssessmentResult, { foreignKey: "attemptId", as: "result" });
AssessmentResult.belongsTo(AssessmentAttempt, { foreignKey: "attemptId", as: "attempt" });

Assessment.hasMany(AssessmentResult, { foreignKey: "assessmentId", as: "results" });
AssessmentResult.belongsTo(Assessment, { foreignKey: "assessmentId", as: "assessment" });

export { Assessment, AssessmentQuestion, AssessmentAttempt, AssessmentAnswer, AssessmentResult };