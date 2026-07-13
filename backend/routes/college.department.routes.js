// college.department.route.js

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as validator from "../validators/college.department.validator.js";
import * as controller from "../controllers/college.department.controller.js";
import * as courseController from "../controllers/college.course.controller.js";

const router = express.Router();

// ------------------------------------------------------------
// Public read endpoints (no auth required per module spec)
// NOTE: '/search' is declared BEFORE '/:id' so Express doesn't
// mistake "search" for a department id.
// ------------------------------------------------------------
router.get("/search", controller.searchDepartments);
router.get("/", controller.getDepartments);
router.get("/:id", controller.getDepartmentById);
router.get("/:id/courses", courseController.getCoursesByDepartment);

// ------------------------------------------------------------
// Protected write endpoints
// ------------------------------------------------------------
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hod"),
  validator.sanitizeInput,
  validator.validateRequestBody,
  validator.validateDepartment,
  controller.createDepartment
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "hod"),
  validator.sanitizeInput,
  validator.validateRequestBody,
  validator.validateDepartmentUpdate,
  controller.updateDepartment
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), controller.deleteDepartment);

export default router;