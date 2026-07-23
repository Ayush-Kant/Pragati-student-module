/**
 * Location: backend/routes/collegeAnalyticsDashboard.routes.js
 */
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// Controllers
import collegeAnalyticsController from "../controllers/collegeAnalytics.controller.js";
import collegeStatisticsController from "../controllers/collegeStatistics.controller.js";
import collegeReportsController from "../controllers/collegeReports.controller.js";

// Validators
import collegeAnalyticsValidator from "../validators/collegeAnalytics.validator.js";
import collegeStatisticsValidator from "../validators/collegeStatistics.validator.js";
import collegeReportsValidator from "../validators/collegeReports.validator.js";

const router = express.Router();


// Apply auth and role verification to all analytics endpoints
router.use(authMiddleware);
router.use(roleMiddleware("college"));

// General Dashboard & Overview KPIs
router.get(
  "/dashboard",
  collegeAnalyticsValidator.sanitizeInput,
  collegeAnalyticsValidator.validateAnalyticsRequest,
  collegeAnalyticsController.getDashboardAnalytics
);

router.get(
  "/overview",
  collegeAnalyticsValidator.sanitizeInput,
  collegeAnalyticsValidator.validateAnalyticsRequest,
  collegeAnalyticsController.getOverviewStatistics
);

// Placement breakdown & trends
router.get(
  "/placements",
  collegeAnalyticsValidator.sanitizeInput,
  collegeAnalyticsValidator.validateFilters,
  collegeAnalyticsController.getPlacementAnalytics
);

router.get(
  "/placement-trends",
  collegeStatisticsValidator.sanitizeInput,
  collegeStatisticsValidator.validateFilters,
  collegeStatisticsController.getPlacementTrend
);

// Recruiters & Departments
router.get(
  "/companies",
  collegeAnalyticsValidator.sanitizeInput,
  collegeAnalyticsValidator.validateFilters,
  collegeAnalyticsController.getCompanyAnalytics
);

router.get(
  "/departments",
  collegeAnalyticsValidator.sanitizeInput,
  collegeAnalyticsValidator.validateFilters,
  collegeAnalyticsController.getDepartmentAnalytics
);

// Students listings analytics
router.get(
  "/students",
  collegeStatisticsValidator.sanitizeInput,
  collegeStatisticsValidator.validateFilters,
  collegeStatisticsController.getStudentAnalytics
);

// Reports
router.get(
  "/company-report",
  collegeReportsValidator.sanitizeInput,
  collegeReportsValidator.validateFilters,
  collegeReportsController.getCompanyReport
);

router.get(
  "/department-report",
  collegeReportsValidator.sanitizeInput,
  collegeReportsValidator.validateFilters,
  collegeReportsController.getDepartmentReport
);

router.get(
  "/student-report",
  collegeReportsValidator.sanitizeInput,
  collegeReportsValidator.validateFilters,
  collegeReportsController.getStudentReport
);

// Exports
router.get(
  "/export/pdf",
  collegeReportsValidator.sanitizeInput,
  collegeReportsValidator.validateExportRequest,
  collegeReportsController.exportAnalytics
);

router.get(
  "/export/excel",
  collegeReportsValidator.sanitizeInput,
  collegeReportsValidator.validateExportRequest,
  collegeReportsController.exportAnalytics
);

export default router;
