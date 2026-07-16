import StudentAssessmentService from "../services/student.assessment.service.js";

const getUserId = (req) => {
  if (!req.user) {
    return null;
  }

  return req.user.id ?? req.user.userId ?? req.user.sub ?? null;
};

export const getAssessments = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const data = await StudentAssessmentService.getAssignedAssessments(studentId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch student assessments:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getAssessment = async (req, res) => {
  try {
    const assessmentId = Number(req.params.id);
    if (Number.isNaN(assessmentId)) {
      return res.status(400).json({ error: "Invalid assessment id." });
    }

    const data = await StudentAssessmentService.getAssessmentDetails(assessmentId);
    if (!data) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch assessment details:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const startAssessment = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const assessmentId = Number(req.params.id);

    if (!studentId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (Number.isNaN(assessmentId)) {
      return res.status(400).json({ error: "Invalid assessment id." });
    }

    const data = await StudentAssessmentService.startAttempt(studentId, assessmentId);
    return res.status(201).json(data);
  } catch (error) {
    console.error("Failed to start assessment:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const assessmentId = Number(req.params.id);

    if (!studentId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (Number.isNaN(assessmentId)) {
      return res.status(400).json({ error: "Invalid assessment id." });
    }

    const data = await StudentAssessmentService.submitAttempt(studentId, assessmentId, req.body.answers || []);
    if (!data) {
      return res.status(404).json({ error: "No active assessment attempt found." });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to submit assessment:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getResult = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const assessmentId = Number(req.params.id);

    if (!studentId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (Number.isNaN(assessmentId)) {
      return res.status(400).json({ error: "Invalid assessment id." });
    }

    const data = await StudentAssessmentService.getResult(studentId, assessmentId);
    if (!data) {
      return res.status(404).json({ error: "Assessment result not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch assessment result:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};