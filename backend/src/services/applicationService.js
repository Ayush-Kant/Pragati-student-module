import Application from "../models/applicationModel.js";
import sequelize from "../../config/sequelize.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";
import { ERROR_CODES } from "../constants/placementConstants.js";

export const getApplications = async (studentId, filters = {}) => {
  const whereClause = { studentId };
  if (filters.status) whereClause.status = filters.status;
  const apps = await Application.findAll({
    where: whereClause,
    order: [["created_at", "DESC"]],
  });
  return apps.map((a) => (a.toJSON ? a.toJSON() : a));
};

export const getApplicationById = async (studentId, applicationId) => {
  const appId = Number(applicationId);

  const app = await Application.findOne({
    where: { id: appId, studentId },
  });
  if (!app) {
    const error = new Error("Application not found or access denied");
    error.status = 404;
    error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
    throw error;
  }
  return app.toJSON ? app.toJSON() : app;
};

export const createApplication = async (studentId, data) => {
  const { companyName, jobTitle, jobId, notes } = data;
  const normalizedCompany = companyName.trim();
  const normalizedTitle = jobTitle.trim();

  const initialHistory = [
    {
      status: "APPLIED",
      changedAt: new Date().toISOString(),
      note: "Application submitted",
    },
  ];

  try {
    return await sequelize.transaction(async (transaction) => {
      const existingApps = await Application.findAll({
        where: { studentId },
        transaction,
        lock: transaction.LOCK ? transaction.LOCK.UPDATE : undefined,
      });

      const isDuplicate = existingApps.some(
        (a) =>
          a.companyName.toLowerCase() === normalizedCompany.toLowerCase() &&
          a.jobTitle.toLowerCase() === normalizedTitle.toLowerCase() &&
          a.status !== "WITHDRAWN" &&
          a.status !== "REJECTED"
      );

      if (isDuplicate) {
        const error = new Error("An active application already exists for this company and position");
        error.status = 409;
        error.code = ERROR_CODES.DUPLICATE_APPLICATION;
        throw error;
      }

      const app = await Application.create(
        {
          studentId,
          companyName: normalizedCompany,
          jobTitle: normalizedTitle,
          jobId: jobId || null,
          status: "APPLIED",
          appliedDate: data.appliedDate || new Date(),
          notes: notes || null,
          history: initialHistory,
        },
        { transaction }
      );

      return app.toJSON ? app.toJSON() : app;
    });
  } catch (dbErr) {
    if (dbErr.status) {
      throw dbErr;
    }
    if (dbErr.name === "SequelizeUniqueConstraintError") {
      const error = new Error("An active application already exists for this company and position");
      error.status = 409;
      error.code = ERROR_CODES.DUPLICATE_APPLICATION;
      throw error;
    }
    throw dbErr;
  }
};

export const updateApplicationStatus = async (studentId, applicationId, targetStatus, note = "") => {
  const appId = Number(applicationId);

  return await sequelize.transaction(async (transaction) => {
    const dbApp = await Application.findOne({
      where: { id: appId, studentId },
      transaction,
      lock: transaction.LOCK ? transaction.LOCK.UPDATE : undefined,
    });

    if (!dbApp) {
      const error = new Error("Application not found or access denied");
      error.status = 404;
      error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
      throw error;
    }

    if (!isValidApplicationTransition(dbApp.status, targetStatus)) {
      const error = new Error(
        `Invalid application status transition from ${dbApp.status} to ${targetStatus}`
      );
      error.status = 400;
      error.code = ERROR_CODES.INVALID_STATUS_TRANSITION;
      throw error;
    }

    const updatedHistory = [
      ...(dbApp.history || []),
      {
        status: targetStatus,
        previousStatus: dbApp.status,
        changedAt: new Date().toISOString(),
        note: note || `Status updated to ${targetStatus}`,
      },
    ];

    dbApp.status = targetStatus;
    dbApp.history = updatedHistory;
    await dbApp.save({ transaction });

    return dbApp.toJSON ? dbApp.toJSON() : dbApp;
  });
};

export const deleteApplication = async (studentId, applicationId) => {
  const appId = Number(applicationId);

  return await sequelize.transaction(async (transaction) => {
    const dbApp = await Application.findOne({
      where: { id: appId, studentId },
      transaction,
      lock: transaction.LOCK ? transaction.LOCK.UPDATE : undefined,
    });

    if (!dbApp) {
      const error = new Error("Application not found or access denied");
      error.status = 404;
      error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
      throw error;
    }

    if (dbApp.status !== "WITHDRAWN") {
      const updatedHistory = [
        ...(dbApp.history || []),
        {
          status: "WITHDRAWN",
          previousStatus: dbApp.status,
          changedAt: new Date().toISOString(),
          note: "Application withdrawn by student",
        },
      ];
      dbApp.status = "WITHDRAWN";
      dbApp.history = updatedHistory;
      await dbApp.save({ transaction });
    }

    return { success: true, id: dbApp.id, status: "WITHDRAWN", message: "Application withdrawn successfully" };
  });
};

export default {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
};
