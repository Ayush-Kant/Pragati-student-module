import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import studentAuthController from "../controllers/studentAuth.controller.js";

const router = express.Router();

// Legacy/shared authentication routes retained for existing platform roles.
router.post("/login", login);
router.post("/register", register);

// PRD SM-01 student-specific Firebase/JWT lifecycle.
router.post("/student/register", studentAuthController.register);
router.post("/student/login", studentAuthController.login);
router.post("/student/refresh", studentAuthController.refresh);
router.post("/student/logout", studentAuthController.logout);

export default router;
