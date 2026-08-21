import express from "express";
import authenticateJWT from "../middleware/authMiddleware.js";
import { extractStudentId, enforceStudentIsolation } from "../middleware/placementMiddleware.js";
import {
  validateApplication,
  validateApplicationStatus,
  validateInterview,
  validateApplicationOwnership,
  validateInterviewOwnership,
  validateDateRange,
} from "../validations/placementValidation.js";

import placementService from "../services/placementService.js";
import applicationService from "../services/applicationService.js";
import interviewService from "../services/interviewService.js";
import readinessService from "../services/readinessService.js";
import analyticsService from "../services/analyticsService.js";
import { formatSuccessResponse, formatErrorResponse } from "../utils/placementHelpers.js";

const router = express.Router();

router.use(authenticateJWT, extractStudentId, enforceStudentIsolation);

// --- Placement Dashboard ---
router.get("/dashboard", async (req, res, next) => {
  try {
    const dashboard = await placementService.getPlacementDashboard(req.studentId);
    return res.json(formatSuccessResponse(dashboard, "Dashboard retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

// --- Applications Management ---
router.get("/applications", async (req, res, next) => {
  try {
    const applications = await applicationService.getApplications(req.studentId, req.query);
    return res.json(formatSuccessResponse(applications, "Applications retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

router.get("/applications/:applicationId", validateApplicationOwnership, async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.studentId,
      req.params.applicationId
    );
    return res.json(formatSuccessResponse(application, "Application details retrieved successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
});

router.post("/applications", validateApplication, async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.studentId, req.body);
    return res
      .status(201)
      .json(formatSuccessResponse(application, "Application created successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
});

router.patch(
  "/applications/:applicationId/status",
  validateApplicationOwnership,
  validateApplicationStatus,
  async (req, res, next) => {
    try {
      const updatedApp = await applicationService.updateApplicationStatus(
        req.studentId,
        req.params.applicationId,
        req.body.status,
        req.body.note
      );
      return res.json(formatSuccessResponse(updatedApp, "Application status updated successfully"));
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json(formatErrorResponse(error.message, error.code));
      }
      next(error);
    }
  }
);

router.delete("/applications/:applicationId", validateApplicationOwnership, async (req, res, next) => {
  try {
    const result = await applicationService.deleteApplication(
      req.studentId,
      req.params.applicationId
    );
    return res.json(formatSuccessResponse(result, "Application withdrawn successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
});

// --- Interviews Management ---
router.get("/interviews", async (req, res, next) => {
  try {
    const interviews = await interviewService.getInterviews(req.studentId, req.query);
    return res.json(formatSuccessResponse(interviews, "Interviews retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

router.get("/interviews/:interviewId", validateInterviewOwnership, async (req, res, next) => {
  try {
    const interview = await interviewService.getInterviewById(
      req.studentId,
      req.params.interviewId
    );
    return res.json(formatSuccessResponse(interview, "Interview details retrieved successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
});

router.post("/interviews", validateInterview, async (req, res, next) => {
  try {
    const interview = await interviewService.createInterview(req.studentId, req.body);
    return res
      .status(201)
      .json(formatSuccessResponse(interview, "Interview scheduled successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
});

router.patch(
  "/interviews/:interviewId",
  validateInterviewOwnership,
  async (req, res, next) => {
    try {
      const updatedInterview = await interviewService.updateInterview(
        req.studentId,
        req.params.interviewId,
        req.body
      );
      return res.json(formatSuccessResponse(updatedInterview, "Interview updated successfully"));
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json(formatErrorResponse(error.message, error.code));
      }
      next(error);
    }
  }
);

// --- Skills & Readiness ---
router.get("/skills", async (req, res, next) => {
  try {
    const skills = await readinessService.getSkillReadiness(req.studentId);
    return res.json(formatSuccessResponse(skills, "Skill readiness retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

router.get("/skills/gaps", async (req, res, next) => {
  try {
    const skillGaps = await readinessService.getSkillGaps(req.studentId);
    return res.json(formatSuccessResponse(skillGaps, "Skill gaps retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

router.get("/readiness", async (req, res, next) => {
  try {
    const readinessReport = await readinessService.getReadinessReport(req.studentId);
    return res.json(formatSuccessResponse(readinessReport, "Readiness report retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

// --- Analytics & Recommendations ---
router.get("/analytics", validateDateRange, async (req, res, next) => {
  try {
    const analytics = await analyticsService.getPlacementAnalytics(req.studentId);
    return res.json(formatSuccessResponse(analytics, "Placement analytics retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

router.get("/recommendations", async (req, res, next) => {
  try {
    const recommendations = await analyticsService.getCareerRecommendations(req.studentId);
    return res.json(formatSuccessResponse(recommendations, "Career recommendations retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

export default router;
