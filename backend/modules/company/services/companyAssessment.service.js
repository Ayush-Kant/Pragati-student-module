import * as repository from "../repositories/companyAssessment.repository.js";

export const getAssessmentsService = async () => {
  return await repository.getAssessmentsRepo();
};

export const getAssessmentByIdService = async (id) => {
  return await repository.getAssessmentByIdRepo(id);
};

export const createAssessmentService = async (body) => {
  return await repository.createAssessmentRepo(body);
};

export const updateAssessmentService = async (
  id,
  body
) => {
  return await repository.updateAssessmentRepo(id, body);
};

export const archiveAssessmentService = async (id) => {
  return await repository.archiveAssessmentRepo(id);
};

export const assignAssessmentService = async (
  assessmentId,
  driveId
) => {
  return await repository.assignAssessmentRepo(
    assessmentId,
    driveId
  );
};