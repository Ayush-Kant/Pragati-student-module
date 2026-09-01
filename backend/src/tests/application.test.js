import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import Application from "../models/applicationModel.js";
import sequelize from "../../config/sequelize.js";
import applicationService from "../services/applicationService.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";

describe("Application Service", () => {
  let mockTransaction;
  let committed = false;
  let rolledBack = false;

  beforeEach(() => {
    committed = false;
    rolledBack = false;
    mockTransaction = {
      commit: async () => { committed = true; },
      rollback: async () => { rolledBack = true; },
      finished: false,
      LOCK: { UPDATE: "UPDATE" },
    };
    sequelize.transaction = async (arg1, arg2) => {
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
    };
  });

  it("isValidApplicationTransition validates transitions", () => {
    assert.strictEqual(isValidApplicationTransition("APPLIED", "SHORTLISTED"), true);
    assert.strictEqual(isValidApplicationTransition("SHORTLISTED", "TECHNICAL_INTERVIEW"), true);
    assert.strictEqual(isValidApplicationTransition("REJECTED", "SELECTED"), false);
  });

  it("createApplication creates application and records initial history", async () => {
    Application.findAll = async () => [];
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
    Application.create = async () => mockApp;

    const created = await applicationService.createApplication(201, {
      companyName: "Google",
      jobTitle: "Software Engineer",
    });

    assert.strictEqual(created.id, 1);
    assert.strictEqual(created.status, "APPLIED");
    assert.strictEqual(committed, true);
  });

  it("createApplication throws 409 conflict when duplicate application created", async () => {
    const existingApp = {
      companyName: "Google",
      jobTitle: "Software Engineer",
      status: "APPLIED",
    };
    Application.findAll = async () => [existingApp];

    await assert.rejects(
      async () => {
        await applicationService.createApplication(201, {
          companyName: "Google",
          jobTitle: "Software Engineer",
        });
      },
      (err) => err.status === 409 && err.code === "DUPLICATE_APPLICATION"
    );
    assert.strictEqual(rolledBack, true);
  });

  it("updateApplicationStatus performs valid status transition and records history", async () => {
    let saved = false;
    const dbApp = {
      id: 10,
      studentId: 202,
      status: "APPLIED",
      history: [{ status: "APPLIED" }],
      save: async function () { saved = true; },
      toJSON: function () {
        return this;
      },
    };
    Application.findOne = async () => dbApp;

    const updated = await applicationService.updateApplicationStatus(202, 10, "SHORTLISTED");

    assert.strictEqual(updated.status, "SHORTLISTED");
    assert.strictEqual(saved, true);
    assert.strictEqual(committed, true);
  });

  it("updateApplicationStatus rejects invalid status transition with 400 error", async () => {
    const dbApp = {
      id: 10,
      studentId: 203,
      status: "REJECTED",
      history: [{ status: "REJECTED" }],
    };
    Application.findOne = async () => dbApp;

    await assert.rejects(
      async () => {
        await applicationService.updateApplicationStatus(203, 10, "SELECTED");
      },
      (err) => err.status === 400 && err.code === "INVALID_STATUS_TRANSITION"
    );
    assert.strictEqual(rolledBack, true);
  });

  it("getApplicationById throws 404 for non-existent or other student application", async () => {
    Application.findOne = async () => null;

    await assert.rejects(
      async () => {
        await applicationService.getApplicationById(204, 99999);
      },
      (err) => err.status === 404
    );
  });

  it("deleteApplication withdraws application successfully and retains record", async () => {
    let saved = false;
    const dbApp = {
      id: 15,
      studentId: 205,
      status: "APPLIED",
      history: [],
      save: async function () { saved = true; },
    };
    Application.findOne = async () => dbApp;

    const deleteResult = await applicationService.deleteApplication(205, 15);
    assert.strictEqual(deleteResult.success, true);
    assert.strictEqual(deleteResult.status, "WITHDRAWN");
    assert.strictEqual(dbApp.status, "WITHDRAWN");
    assert.strictEqual(committed, true);
  });
});
