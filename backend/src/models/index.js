import Assessment from "./assessmentModel.js";
import AssessmentQuestion from "./assessmentQuestionModel.js";
import AssessmentAttempt from "./assessmentAttemptModel.js";
import AssessmentAnswer from "./assessmentAnswerModel.js";
import AssessmentResult from "./assessmentResultModel.js";
import { Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer, QuizResult } from "./quizModel.js";

// Assessment associations
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

// Quiz associations
Quiz.hasMany(QuizQuestion, { foreignKey: "quizId", as: "questions" });
QuizQuestion.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

QuizQuestion.hasMany(QuizOption, { foreignKey: "quizQuestionId", as: "options" });
QuizOption.belongsTo(QuizQuestion, { foreignKey: "quizQuestionId", as: "question" });

Quiz.hasMany(QuizAttempt, { foreignKey: "quizId", as: "attempts" });
QuizAttempt.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

QuizAttempt.hasMany(QuizAnswer, { foreignKey: "quizAttemptId", as: "answers" });
QuizAnswer.belongsTo(QuizAttempt, { foreignKey: "quizAttemptId", as: "attempt" });

QuizAnswer.belongsTo(QuizQuestion, { foreignKey: "questionId", as: "question" });
QuizQuestion.hasMany(QuizAnswer, { foreignKey: "questionId", as: "answers" });

QuizAttempt.hasOne(QuizResult, { foreignKey: "quizAttemptId", as: "result" });
QuizResult.belongsTo(QuizAttempt, { foreignKey: "quizAttemptId", as: "attempt" });

Quiz.hasMany(QuizResult, { foreignKey: "quizId", as: "results" });
QuizResult.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

export { Assessment, AssessmentQuestion, AssessmentAttempt, AssessmentAnswer, AssessmentResult, Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer, QuizResult };