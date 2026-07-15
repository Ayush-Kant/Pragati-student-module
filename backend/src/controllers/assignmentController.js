import assignmentService from "../services/assignmentService.js";

export const getAllAssignments = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAssignments(req.query);
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getAssignment(req.params.id);
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export default { getAllAssignments, getAssignmentById };
