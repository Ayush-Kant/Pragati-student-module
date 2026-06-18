import AdminAssessmentService from "../services/admin.assessment.service.js";

const createAssessment = async (req, res) => {
  try {
    const createdBy = req.user ? req.user.id : null;
    await AdminAssessmentService.createAssessment(req.body, createdBy);
    
    res.status(201).json({ message: "Assessment created as draft." });
  } catch (error) {
    console.error("Failed to create assessment:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const getAssessments = async (req, res) => {
  try {
    // Extract filters and pagination options from the query
    const { type, difficulty, status, page = 1, limit = 20 } = req.query;
    
    const filters = { type, difficulty, status };
    const data = await AdminAssessmentService.getAllAssessments(
      filters, 
      parseInt(page, 10), 
      parseInt(limit, 10)
    );
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    // clean up the id (e.g. "assess_401" -> 401)
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    
    const assessment = await AdminAssessmentService.getAssessmentById(id);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    res.status(200).json(assessment);
  } catch (error) {
    console.error("Failed to fetch assessment details:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    const assessment = await AdminAssessmentService.updateAssessment(id, req.body);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    res.status(200).json({ message: "Assessment updated successfully." });
  } catch (error) {
    console.error("Failed to update assessment:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const publishAssessment = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    const assessment = await AdminAssessmentService.publishAssessment(id);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found or not in draft status" });
    }
    
    res.status(200).json({ message: "Assessment published successfully." });
  } catch (error) {
    console.error("Failed to publish assessment:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const archiveAssessment = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    const assessment = await AdminAssessmentService.archiveAssessment(id);
    
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    
    res.status(200).json({ message: "Assessment archived successfully." });
  } catch (error) {
    console.error("Failed to archive assessment:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const addQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    await AdminAssessmentService.addQuestion(id, req.body);
    
    res.status(201).json({ message: "Question added successfully." });
  } catch (error) {
    console.error("Failed to add question:", error);
    if (error.message === 'Assessment not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    const qid = req.params.qid;
    
    const question = await AdminAssessmentService.updateQuestion(id, qid, req.body);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    
    res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    console.error("Failed to update question:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    const qid = req.params.qid;
    
    const question = await AdminAssessmentService.deleteQuestion(id, qid);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    
    res.status(200).json({ message: "Question removed successfully." });
  } catch (error) {
    console.error("Failed to delete question:", error);
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

const assignDrive = async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('assess_', ''), 10) || req.params.id;
    const { driveId } = req.body;
    
    await AdminAssessmentService.assignToDrive(id, driveId);
    
    res.status(200).json({ message: "Assessment assigned to drive." });
  } catch (error) {
    console.error("Failed to assign drive:", error);
    if (error.message === 'Drive not found' || error.message === 'Assessment not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
};

export {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  publishAssessment,
  archiveAssessment,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  assignDrive
};
