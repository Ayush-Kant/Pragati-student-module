// college.departmentstatistics.route.js

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as validator from "../validators/college.departmentstatistics.validator.js";
import * as controller from "../controllers/college.departmentstatistics.controller.js";

const router = express.Router();
router.use((req, res, next) => {
  console.log("******** Department Statistics Route Hit ********");
  next();
});

// ------------------------------------------------------------
// Public read endpoint
// ------------------------------------------------------------
router.get("/", controller.getDepartmentStatistics);

// ------------------------------------------------------------
// Protected write endpoint
// ------------------------------------------------------------
router.put(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hod", "college"),
  validator.validateStatisticsUpdate,
  controller.updateDepartmentStatistics
);

export default router;