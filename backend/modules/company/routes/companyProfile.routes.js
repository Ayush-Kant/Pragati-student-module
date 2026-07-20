import express from "express";

import {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyTeam,
  createCompanyTeamMember,
  updateCompanyTeamMember,
  deleteCompanyTeamMember,
  getCompanySettings,
  updateCompanySettings,
  uploadCompanyLogo,
} from "../controllers/companyProfile.controller.js";

import authMiddleware from "../../../middleware/authMiddleware.js";

import roleMiddleware from "../../../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/settings", authMiddleware, getCompanySettings);
router.put("/settings", authMiddleware, updateCompanySettings);
router.post("/logo", authMiddleware, uploadCompanyLogo);

router.get("/profile", authMiddleware, getCompanyProfile);

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("company"),
  updateCompanyProfile,
);

router.get("/team", authMiddleware, getCompanyTeam);

router.post(
  "/team",
  authMiddleware,
  roleMiddleware("company"),
  createCompanyTeamMember,
);

router.patch(
  "/team/:id",
  authMiddleware,
  roleMiddleware("company"),
  updateCompanyTeamMember,
);

router.delete(
  "/team/:id",
  authMiddleware,
  roleMiddleware("company"),
  deleteCompanyTeamMember,
);

export default router;
