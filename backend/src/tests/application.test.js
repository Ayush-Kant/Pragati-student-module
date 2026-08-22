import { describe, it, expect } from "@jest/globals";

import applicationService from "../services/applicationService.js";
import { isValidApplicationTransition } from "../utils/placementHelpers.js";

describe("Application Service", () => {
  it("isValidApplicationTransition allows valid state machine transitions", () => {
    expect(isValidApplicationTransition("APPLIED", "SHORTLISTED")).toBe(true);
    expect(isValidApplicationTransition("SHORTLISTED", "TECHNICAL_INTERVIEW")).toBe(true);
    expect(isValidApplicationTransition("TECHNICAL_INTERVIEW", "SELECTED")).toBe(true);
    expect(isValidApplicationTransition("APPLIED", "REJECTED")).toBe(true);
    expect(isValidApplicationTransition("ASSESSMENT", "WITHDRAWN")).toBe(true);
  });

  it("isValidApplicationTransition rejects invalid state machine transitions", () => {
    expect(isValidApplicationTransition("REJECTED", "SELECTED")).toBe(false);
    expect(isValidApplicationTransition("WITHDRAWN", "TECHNICAL_INTERVIEW")).toBe(false);
    expect(isValidApplicationTransition("SELECTED", "APPLIED")).toBe(false);
  });

  it("createApplication creates application and records initial history", async () => {
    const studentId = 201;
    const appData = {
      companyName: "Google",
      jobTitle: "Software Engineer",
      notes: "Applied via campus drive",
    };

    const created = await applicationService.createApplication(studentId, appData);

    expect(created.id).toBeDefined();
    expect(created.studentId).toBe(201);
    expect(created.companyName).toBe("Google");
    expect(created.jobTitle).toBe("Software Engineer");
    expect(created.status).toBe("APPLIED");
    expect(Array.isArray(created.history)).toBe(true);
    expect(created.history[0].status).toBe("APPLIED");
  });

  it("createApplication throws 409 conflict when duplicate application created", async () => {
    const studentId = 201;
    const appData = {
      companyName: "Google",
      jobTitle: "Software Engineer",
    };

    await expect(applicationService.createApplication(studentId, appData)).rejects.toMatchObject({
      status: 409,
      code: "DUPLICATE_APPLICATION",
    });
  });

  it("updateApplicationStatus performs valid status transition and records history", async () => {
    const studentId = 202;
    const created = await applicationService.createApplication(studentId, {
      companyName: "Microsoft",
      jobTitle: "Frontend Developer",
    });

    const updated = await applicationService.updateApplicationStatus(
      studentId,
      created.id,
      "SHORTLISTED",
      "Shortlisted for technical round"
    );

    expect(updated.status).toBe("SHORTLISTED");
    expect(updated.history.length).toBe(2);
    expect(updated.history[1].status).toBe("SHORTLISTED");
  });

  it("updateApplicationStatus rejects invalid status transition with 400 error", async () => {
    const studentId = 203;
    const created = await applicationService.createApplication(studentId, {
      companyName: "Amazon",
      jobTitle: "Backend Developer",
    });

    await applicationService.updateApplicationStatus(studentId, created.id, "REJECTED");

    await expect(
      applicationService.updateApplicationStatus(studentId, created.id, "SELECTED")
    ).rejects.toMatchObject({
      status: 400,
      code: "INVALID_STATUS_TRANSITION",
    });
  });

  it("getApplicationById throws 404 for non-existent or other student application", async () => {
    const studentId = 204;
    await expect(applicationService.getApplicationById(studentId, 99999)).rejects.toMatchObject({
      status: 404,
    });
  });

  it("deleteApplication withdraws application successfully", async () => {
    const studentId = 205;
    const created = await applicationService.createApplication(studentId, {
      companyName: "Meta",
      jobTitle: "Data Engineer",
    });

    const deleteResult = await applicationService.deleteApplication(studentId, created.id);
    expect(deleteResult.success).toBe(true);
  });
});
