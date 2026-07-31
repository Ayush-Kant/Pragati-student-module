import express from "express";
import gradeController from "../controllers/gradeController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignmentId } from "../validators/assignmentValidator.js";
import { validateGrade } from "../validators/gradeValidator.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeAssignmentAccess } from "../middleware/authorizeAssignmentAccess.js";

const router = express.Router();

router.get("/grades", authenticateJWT, gradeController.getGrades);
router.patch("/:id/grade", authenticateJWT, authorizeAssignmentAccess, validateRequest(validateAssignmentId), validateRequest(validateGrade), gradeController.updateGrades);

export default router;
