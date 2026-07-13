import * as EligibilityModel from "../models/eligibilityModel.js";
import * as PlacementDriveModel from "../models/placementDriveModel.js";

const checkDriveExists = async (driveId) => {
  const id = Number(driveId);

  const drive = await PlacementDriveModel.getPlacementDriveById(id);

  if (!drive) {
    const error = new Error("Placement Drive not found");
    error.statusCode = 404;
    throw error;
  }

  return drive;
};

export const getEligibility = async (driveId) => {
  const id = Number(driveId);

  await checkDriveExists(id);

  const eligibility = await EligibilityModel.getEligibilityCriteria(id);

  if (!eligibility) {
    const error = new Error("Eligibility criteria not found for this drive");
    error.statusCode = 404;
    throw error;
  }

  return eligibility;
};

export const addEligibility = async (driveId, data) => {
  const id = Number(driveId);

  await checkDriveExists(id);

  const existing = await EligibilityModel.getEligibilityCriteria(id);

  if (existing) {
    const error = new Error("Eligibility criteria already exists.");
    error.statusCode = 409;
    throw error;
  }

  return await EligibilityModel.createEligibilityCriteria(id, data);
};

export const updateEligibility = async (driveId, data) => {
  const id = Number(driveId);

  await checkDriveExists(id);

  const existing = await EligibilityModel.getEligibilityCriteria(id);

  if (!existing) {
    const error = new Error("Eligibility criteria not found.");
    error.statusCode = 404;
    throw error;
  }

  return await EligibilityModel.updateEligibilityCriteria(id, data);
};

export const removeEligibility = async (driveId) => {
  const id = Number(driveId);

  await checkDriveExists(id);

  return await EligibilityModel.deleteEligibilityCriteria(id);
};