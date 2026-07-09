import express from "express";
import scheduleController from "../controllers/scheduleController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeStudent);

router.get(
  "/",
  scheduleController.getSchedules
);


router.get(
  "/upcoming",
  scheduleController.getUpcomingSessions
);


export default router;