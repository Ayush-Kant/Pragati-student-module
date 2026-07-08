import express from "express";

import liveSessionController from "../controllers/liveSessionController.js";
import recordingRoutes from "./recordingRoutes.js";
import attendanceRoutes from "./attendanceRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";

const router = express.Router();


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
  liveSessionController.getSessionById
);


router.post(
  "/:id/join",
  liveSessionController.joinSession
);


router.post(
  "/:id/leave",
  liveSessionController.leaveSession
);


export default router;