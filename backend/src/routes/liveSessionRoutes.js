import express from "express";

import liveSessionController from "../controllers/liveSessionController.js";
import recordingRoutes from "./recordingRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import participantRoutes from "./participantRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateSessionId } from "../validators/liveSessionValidator.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.use("/recordings", recordingRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/participants", participantRoutes);
router.use("/schedules", scheduleRoutes);

router.get("/", liveSessionController.getAllSessions);

router.get(
  "/:id",
  validateRequest(validateSessionId, "params"),
  liveSessionController.getSessionById,
);

router.post(
  "/:id/join",
  validateRequest(validateSessionId, "params"),
  liveSessionController.joinSession,
);

router.post(
  "/:id/leave",
  validateRequest(validateSessionId, "params"),
  liveSessionController.leaveSession,
);

export default router;
