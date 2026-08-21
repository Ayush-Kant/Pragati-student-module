import Application from "../models/applicationModel.js";
import connectDB from "../../config/db.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";
import { ERROR_CODES } from "../constants/placementConstants.js";

const mockApplications = [];
let mockIdCounter = 1;

export const getApplications = async (studentId, filters = {}) => {
  try {
    if (Application.sequelize) {
      const whereClause = { studentId };
      if (filters.status) whereClause.status = filters.status;
      const apps = await Application.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      });
      return apps.map((a) => (a.toJSON ? a.toJSON() : a));
    }
  } catch (e) {
    // Fallback
  }

  return mockApplications.filter(
    (a) => a.studentId === studentId && (!filters.status || a.status === filters.status)
  );
};

export const getApplicationById = async (studentId, applicationId) => {
  const appId = Number(applicationId);

  try {
    if (Application.sequelize) {
      const app = await Application.findOne({
        where: { id: appId, studentId },
      });
      if (app) return app.toJSON ? app.toJSON() : app;
    }
  } catch (e) {
    // Fallback
  }

  const app = mockApplications.find((a) => a.id === appId && a.studentId === studentId);
  if (!app) {
    const error = new Error("Application not found or access denied");
    error.status = 404;
    error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
    throw error;
  }
  return app;
};

export const createApplication = async (studentId, data) => {
  const { companyName, jobTitle, jobId, notes } = data;

  const existingApps = await getApplications(studentId);
  const isDuplicate = existingApps.some(
    (a) =>
      a.companyName.toLowerCase() === companyName.toLowerCase() &&
      a.jobTitle.toLowerCase() === jobTitle.toLowerCase() &&
      a.status !== "WITHDRAWN" &&
      a.status !== "REJECTED"
  );

  if (isDuplicate) {
    const error = new Error("An active application already exists for this company and position");
    error.status = 409;
    error.code = ERROR_CODES.DUPLICATE_APPLICATION;
    throw error;
  }

  const initialHistory = [
    {
      status: "APPLIED",
      changedAt: new Date().toISOString(),
      note: "Application submitted",
    },
  ];

  const sequelizeInstance = connectDB.sequelize;
  let transaction = null;

  if (sequelizeInstance && typeof sequelizeInstance.transaction === "function") {
    try {
      transaction = await sequelizeInstance.transaction();
      const app = await Application.create(
        {
          studentId,
          companyName: companyName.trim(),
          jobTitle: jobTitle.trim(),
          jobId: jobId || null,
          status: "APPLIED",
          appliedDate: data.appliedDate || new Date(),
          notes: notes || null,
          history: initialHistory,
        },
        { transaction }
      );

      await transaction.commit();
      return app.toJSON ? app.toJSON() : app;
    } catch (dbErr) {
      if (transaction) await transaction.rollback();
    }
  }

  const newApp = {
    id: mockIdCounter++,
    studentId,
    companyName: companyName.trim(),
    jobTitle: jobTitle.trim(),
    jobId: jobId || null,
    status: "APPLIED",
    appliedDate: data.appliedDate || new Date().toISOString(),
    notes: notes || null,
    history: initialHistory,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockApplications.push(newApp);
  return newApp;
};

export const updateApplicationStatus = async (studentId, applicationId, targetStatus, note = "") => {
  const app = await getApplicationById(studentId, applicationId);

  if (!isValidApplicationTransition(app.status, targetStatus)) {
    const error = new Error(
      `Invalid application status transition from ${app.status} to ${targetStatus}`
    );
    error.status = 400;
    error.code = ERROR_CODES.INVALID_STATUS_TRANSITION;
    throw error;
  }

  const updatedHistory = [
    ...(app.history || []),
    {
      status: targetStatus,
      previousStatus: app.status,
      changedAt: new Date().toISOString(),
      note: note || `Status updated to ${targetStatus}`,
    },
  ];

  const sequelizeInstance = connectDB.sequelize;
  let transaction = null;

  if (sequelizeInstance && typeof sequelizeInstance.transaction === "function" && Application.sequelize) {
    try {
      transaction = await sequelizeInstance.transaction();
      const dbApp = await Application.findOne({
        where: { id: app.id, studentId },
        transaction,
      });

      if (dbApp) {
        dbApp.status = targetStatus;
        dbApp.history = updatedHistory;
        await dbApp.save({ transaction });
        await transaction.commit();
        return dbApp.toJSON ? dbApp.toJSON() : dbApp;
      }
    } catch (dbErr) {
      if (transaction) await transaction.rollback();
    }
  }

  app.status = targetStatus;
  app.history = updatedHistory;
  app.updatedAt = new Date().toISOString();
  return app;
};

export const deleteApplication = async (studentId, applicationId) => {
  const app = await getApplicationById(studentId, applicationId);

  const sequelizeInstance = connectDB.sequelize;
  if (sequelizeInstance && typeof sequelizeInstance.transaction === "function" && Application.sequelize) {
    try {
      await Application.destroy({
        where: { id: app.id, studentId },
      });
      return { success: true, id: app.id, message: "Application withdrawn successfully" };
    } catch (e) {
      // Fallback
    }
  }

  const index = mockApplications.findIndex((a) => a.id === app.id && a.studentId === studentId);
  if (index !== -1) {
    mockApplications.splice(index, 1);
  }

  return { success: true, id: app.id, message: "Application withdrawn successfully" };
};

export default {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
};
