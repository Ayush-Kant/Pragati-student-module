import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Application from "../models/applicationModel.js";
import sequelize from "../../config/sequelize.js";
import applicationService from "../services/applicationService.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";

describe("Application Service", () => {
  let mockTransaction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      finished: false,
      LOCK: { UPDATE: "UPDATE" },
    };
    jest.spyOn(sequelize, "transaction").mockImplementation(async (arg1, arg2) => {
      const cb = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : null;
      if (cb) {
        try {
          const res = await cb(mockTransaction);
          await mockTransaction.commit();
          return res;
        } catch (err) {
          await mockTransaction.rollback();
          throw err;
        }
      }
      return mockTransaction;
    });
  });

  it("isValidApplicationTransition validates transitions", () => {
    expect(isValidApplicationTransition("APPLIED", "SHORTLISTED")).toBe(true);
    expect(isValidApplicationTransition("SHORTLISTED", "TECHNICAL_INTERVIEW")).toBe(true);
    expect(isValidApplicationTransition("REJECTED", "SELECTED")).toBe(false);
  });

  it("createApplication creates application and records initial history", async () => {
    jest.spyOn(Application, "findAll").mockResolvedValue([]);
    const mockApp = {
      id: 1,
      studentId: 201,
      companyName: "Google",
      jobTitle: "Software Engineer",
      status: "APPLIED",
      history: [{ status: "APPLIED" }],
      toJSON: function () {
        return this;
      },
    };
    jest.spyOn(Application, "create").mockResolvedValue(mockApp);

    const created = await applicationService.createApplication(201, {
      companyName: "Google",
      jobTitle: "Software Engineer",
    });

    expect(created.id).toBe(1);
    expect(created.status).toBe("APPLIED");
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it("createApplication throws 409 conflict when duplicate application created", async () => {
    const existingApp = {
      companyName: "Google",
      jobTitle: "Software Engineer",
      status: "APPLIED",
    };
    jest.spyOn(Application, "findAll").mockResolvedValue([existingApp]);

    await expect(
      applicationService.createApplication(201, {
        companyName: "Google",
        jobTitle: "Software Engineer",
      })
    ).rejects.toMatchObject({
      status: 409,
      code: "DUPLICATE_APPLICATION",
    });
    expect(mockTransaction.rollback).toHaveBeenCalled();
  });

  it("updateApplicationStatus performs valid status transition and records history", async () => {
    const dbApp = {
      id: 10,
      studentId: 202,
      status: "APPLIED",
      history: [{ status: "APPLIED" }],
      save: jest.fn().mockResolvedValue(),
      toJSON: function () {
        return this;
      },
    };
    jest.spyOn(Application, "findOne").mockResolvedValue(dbApp);

    const updated = await applicationService.updateApplicationStatus(202, 10, "SHORTLISTED");

    expect(updated.status).toBe("SHORTLISTED");
    expect(dbApp.save).toHaveBeenCalled();
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it("updateApplicationStatus rejects invalid status transition with 400 error", async () => {
    const dbApp = {
      id: 10,
      studentId: 203,
      status: "REJECTED",
      history: [{ status: "REJECTED" }],
    };
    jest.spyOn(Application, "findOne").mockResolvedValue(dbApp);

    await expect(
      applicationService.updateApplicationStatus(203, 10, "SELECTED")
    ).rejects.toMatchObject({
      status: 400,
      code: "INVALID_STATUS_TRANSITION",
    });
    expect(mockTransaction.rollback).toHaveBeenCalled();
  });

  it("getApplicationById throws 404 for non-existent or other student application", async () => {
    jest.spyOn(Application, "findOne").mockResolvedValue(null);

    await expect(applicationService.getApplicationById(204, 99999)).rejects.toMatchObject({
      status: 404,
    });
  });

  it("deleteApplication withdraws application successfully and retains record", async () => {
    const dbApp = {
      id: 15,
      studentId: 205,
      status: "APPLIED",
      history: [],
      save: jest.fn().mockResolvedValue(),
    };
    jest.spyOn(Application, "findOne").mockResolvedValue(dbApp);

    const deleteResult = await applicationService.deleteApplication(205, 15);
    expect(deleteResult.success).toBe(true);
    expect(deleteResult.status).toBe("WITHDRAWN");
    expect(dbApp.status).toBe("WITHDRAWN");
    expect(mockTransaction.commit).toHaveBeenCalled();
  });
});
