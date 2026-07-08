import express from "express";
import scheduleController from "../controllers/scheduleController.js";

const router = express.Router();


router.get(
  "/",
  scheduleController.getSchedules
);


router.get(
  "/upcoming",
  scheduleController.getUpcomingSessions
);


export default router;