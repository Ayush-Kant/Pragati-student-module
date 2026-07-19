import express from "express";
import attendanceController from "../controllers/attendanceController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAttendance, validateAttendanceParams, validateAttendanceQuery } from "../validators/attendanceValidator.js";

const router = express.Router();

router.get("/", validateRequest(validateAttendanceQuery, "query"), attendanceController.getAttendance);
router.post("/:id", validateRequest(validateAttendanceParams, "params"), validateRequest(validateAttendance, "body"), attendanceController.markAttendance);
router.patch("/:id", validateRequest(validateAttendanceParams, "params"), validateRequest(validateAttendance, "body"), attendanceController.updateAttendance);

export default router;
