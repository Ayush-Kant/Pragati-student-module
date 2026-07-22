import * as service from "../services/companyAssessment.service.js";

export const getAssessments = async (req, res, next) => {
  try {
    const data =
      await service.getAssessmentsService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentById = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await service.getAssessmentByIdService(
        req.params.id
      );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createAssessment = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await service.createAssessmentService(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Assessment created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAssessment = async (
  req,
  res,
  next
) => {
  try {
    await service.updateAssessmentService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message:
        "Assessment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAssessment = async (
  req,
  res,
  next
) => {
  try {
    await service.archiveAssessmentService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Assessment archived successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const assignAssessment = async (
  req,
  res,
  next
) => {
  try {
    await service.assignAssessmentService(
      req.params.id,
      req.body.driveId
    );

    res.status(200).json({
      success: true,
      message:
        "Assessment assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};