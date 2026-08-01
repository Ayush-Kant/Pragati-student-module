
import express from "express";
import { login, register, promoteAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
// Promote an existing user to admin (protected by ADMIN_PROMOTE_SECRET)
router.post("/promote-admin", promoteAdmin);

export default router;
