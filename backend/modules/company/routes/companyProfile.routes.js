import express from "express";

import {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyTeam,
  createCompanyTeamMember,
  updateCompanyTeamMember,
  deleteCompanyTeamMember,
} from "../controllers/companyProfile.controller.js";

import authMiddleware from "../../../middleware/authMiddleware.js";

import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getCompanyProfile);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("admin"),
  updateCompanyProfile,
);

router.get("/team", authMiddleware, getCompanyTeam);

router.post(
  "/team",
  authMiddleware,
  roleMiddleware("admin"),
  createCompanyTeamMember,
);

router.patch(
  "/team/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCompanyTeamMember,
);

router.delete(
  "/team/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCompanyTeamMember,
);

export default router;
