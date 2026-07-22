import * as service from "../services/questionBank.service.js";

// Helper to get resolved mentor ID or throw 403
const getMentorId = async (req, res) => {
  const userUuid = req.user?.userId || req.user?.id || req.user?.uid;
  if (!userUuid) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }
  const mentorId = await service.resolveMentorIntId(userUuid);
  if (!mentorId) {
    res
      .status(403)
      .json({ success: false, message: "Mentor profile not found" });
    return null;
  }
  return mentorId;
};

export const createQuestion = async (req, res) => {
  try {
    const mentorId = await getMentorId(req, res);
    if (!mentorId) return;

    const result = await service.createQuestion(mentorId, req.body);
    return res.status(201).json({
      success: true,
      questionId: result.questionId,
      message: "Question added to bank",
    });
  } catch (error) {
    console.error("createQuestion Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const mentorId = await getMentorId(req, res);
    if (!mentorId) return;

    const result = await service.getQuestions(mentorId, req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("getQuestions Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const mentorId = await getMentorId(req, res);
    if (!mentorId) return;

    const questionId = parseInt(req.params.id, 10);
    const question = await service.getQuestionById(questionId);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Ownership Verification Check
    if (question.mentor_id !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to edit this question",
      });
    }

    await service.updateQuestion(questionId, mentorId, req.body);
    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("updateQuestion Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const mentorId = await getMentorId(req, res);
    if (!mentorId) return;

    const questionId = parseInt(req.params.id, 10);
    const question = await service.getQuestionById(questionId);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Ownership Verification Check
    if (question.mentor_id !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this question",
      });
    }

    await service.deleteQuestion(questionId);
    return res.status(200).json({
      success: true,
      message: "Question soft-deleted from repository bank successfully",
    });
  } catch (error) {
    console.error("deleteQuestion Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const generateQuiz = async (req, res) => {
  try {
    const mentorId = await getMentorId(req, res);
    if (!mentorId) return;

    const assessmentId = parseInt(req.params.id, 10);
    const result = await service.generateQuiz(mentorId, assessmentId, req.body);

    if (result.status === "NOT_FOUND") {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    if (result.status === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You are not authorized to generate questions for this assessment",
      });
    }

    return res.status(200).json({
      success: true,
      assessmentId,
      questionsAdded: result.questionsAdded,
      message: "Quiz generated successfully",
      questions: result.questions,
    });
  } catch (error) {
    console.error("generateQuiz Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
