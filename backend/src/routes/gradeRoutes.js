import express from "express";
import gradeController from "../controllers/gradeController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignmentParams } from "../validators/assignmentValidator.js";
import { validateGrade } from "../validators/gradeValidator.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeAssignmentAccess } from "../middleware/authorizeAssignmentAccess.js";

const router = express.Router();

router.use(authenticateJWT, authorizeAssignmentAccess);
router.get("/grades", gradeController.getGrades);
router.patch("/:id/grade", validateRequest(validateAssignmentParams, "params"), validateRequest(validateGrade, "body"), gradeController.updateGrades);

export default router;
