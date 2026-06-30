import express from "express";

import {
    createAssessment,
    getAssessments,
    createSubmission,
    getSubmissions
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/assessments", createAssessment);

router.get("/assessments", getAssessments);

router.post("/submissions", createSubmission);

router.get(
    "/submissions/:assessmentId",
    getSubmissions
);

export default router;