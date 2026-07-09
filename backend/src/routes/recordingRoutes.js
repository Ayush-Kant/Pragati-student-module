import express from "express";
import recordingController from "../controllers/recordingController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateRecordingId } from "../validators/recordingValidator.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeStudent);

router.get(
  "/",
  recordingController.getRecordings
);


router.get(
  "/:id",
  validateRequest(validateRecordingId, "params"),
  recordingController.getRecordingById
);


export default router;