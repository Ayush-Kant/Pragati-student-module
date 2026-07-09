import express from "express";

import liveSessionController from "../controllers/liveSessionController.js";
import recordingRoutes from "./recordingRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateSessionId } from "../validators/liveSessionValidator.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeStudent);

// STATIC ROUTES FIRST

router.use("/recordings", recordingRoutes);

router.use("/attendance", attendanceRoutes);

router.use("/schedules", scheduleRoutes);


// SESSION ROUTES LAST

router.get(
  "/",
  liveSessionController.getAllSessions
);


router.get(
  "/:id",
  validateRequest(validateSessionId, "params"),
  liveSessionController.getSessionById
);


router.post(
  "/:id/join",
  validateRequest(validateSessionId, "params"),
  liveSessionController.joinSession
);


router.post(
  "/:id/leave",
  validateRequest(validateSessionId, "params"),
  liveSessionController.leaveSession
);


export default router;