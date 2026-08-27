import Application from "../models/applicationModel.js";
import connectDB from "../../config/db.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";
import { ERROR_CODES } from "../constants/placementConstants.js";

const mockApplications = [];
let mockIdCounter = 1;

const isDbAvailable = () => {
  try {
    return Boolean(connectDB.sequelize && Application.sequelize);
  } catch {
    return false;
  }
};

export const getApplications = async (studentId, filters = {}) => {
  if (isDbAvailable()) {
    const whereClause = { studentId };
    if (filters.status) whereClause.status = filters.status;
    const apps = await Application.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });
    return apps.map((a) => (a.toJSON ? a.toJSON() : a));
  }

  return mockApplications.filter(
    (a) => a.studentId === studentId && (!filters.status || a.status === filters.status)
  );
};

export const getApplicationById = async (studentId, applicationId) => {
  const appId = Number(applicationId);

  if (isDbAvailable()) {
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
  const normalizedCompany = companyName.trim();
  const normalizedTitle = jobTitle.trim();

  const initialHistory = [
    {
      status: "APPLIED",
      changedAt: new Date().toISOString(),
      note: "Application submitted",
    },
  ];

  if (isDbAvailable()) {
    const transaction = await connectDB.sequelize.transaction();
    try {
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

      await transaction.commit();
      return app.toJSON ? app.toJSON() : app;
    } catch (dbErr) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
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
  }

  const existingApps = mockApplications.filter((a) => a.studentId === studentId);
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

  const newApp = {
    id: mockIdCounter++,
    studentId,
    companyName: normalizedCompany,
    jobTitle: normalizedTitle,
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
  const appId = Number(applicationId);

  if (isDbAvailable()) {
    const transaction = await connectDB.sequelize.transaction();
    try {
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
      await transaction.commit();

      return dbApp.toJSON ? dbApp.toJSON() : dbApp;
    } catch (err) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw err;
    }
  }

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

  app.status = targetStatus;
  app.history = updatedHistory;
  app.updatedAt = new Date().toISOString();
  return app;
};

export const deleteApplication = async (studentId, applicationId) => {
  const appId = Number(applicationId);

  if (isDbAvailable()) {
    const transaction = await connectDB.sequelize.transaction();
    try {
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

      await transaction.commit();
      return { success: true, id: dbApp.id, status: "WITHDRAWN", message: "Application withdrawn successfully" };
    } catch (err) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  const app = await getApplicationById(studentId, applicationId);
  if (app.status !== "WITHDRAWN") {
    const updatedHistory = [
      ...(app.history || []),
      {
        status: "WITHDRAWN",
        previousStatus: app.status,
        changedAt: new Date().toISOString(),
        note: "Application withdrawn by student",
      },
    ];
    app.status = "WITHDRAWN";
    app.history = updatedHistory;
    app.updatedAt = new Date().toISOString();
  }

  return { success: true, id: app.id, status: "WITHDRAWN", message: "Application withdrawn successfully" };
};

export default {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
};
