import express from "express";
import recordingController from "../controllers/recordingController.js";

const router = express.Router();


router.get(
  "/",
  recordingController.getRecordings
);


router.get(
  "/:id",
  recordingController.getRecordingById
);


export default router;