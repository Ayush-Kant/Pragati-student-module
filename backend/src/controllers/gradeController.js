import gradeService from "../services/gradeService.js";

export const getGrades = async (req, res, next) => {
  try {
    const grades = await gradeService.getGrades(req.validatedQuery || req.query, req.user);
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    next(error);
  }
};

export const updateGrades = async (req, res, next) => {
  try {
    const grade = await gradeService.updateGrades(req.validatedParams?.id || req.params.id, req.validatedBody || req.body, req.user);
    res.status(200).json({ success: true, message: "Grade updated successfully", data: grade });
  } catch (error) {
    next(error);
  }
};

export default { getGrades, updateGrades };
