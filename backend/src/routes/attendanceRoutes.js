import express from "express";
import attendanceController from "../controllers/attendanceController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAttendance, validateAttendanceParams } from "../validators/attendanceValidator.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeStudent);

router.get("/attendance", attendanceController.getAttendance);
router.post("/:id/attendance", validateRequest(validateAttendanceParams, "params"), validateRequest(validateAttendance, "body"), attendanceController.markAttendance);
router.patch("/:id/attendance", validateRequest(validateAttendanceParams, "params"), validateRequest(validateAttendance, "body"), attendanceController.updateAttendance);

export default router;
