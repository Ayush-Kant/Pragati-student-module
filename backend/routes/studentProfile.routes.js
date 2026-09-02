import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getCompleteness,
  getMyProfile,
  updateAcademic,
  updateCertifications,
  updateContact,
  updateDocuments,
  updateMyProfile,
  updatePersonal,
  updateResume,
  updateSkills,
  updateSocial,
  deleteResume,
} from "../controllers/studentProfile.controller.js";
import {
  validateCertificationsPayload,
  validateDocumentsPayload,
  validateProfileSection,
  validateResumePayload,
  validateSkillsPayload,
  validateStudentProfile,
} from "../validators/studentProfile.validator.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/", getMyProfile);
router.put("/", validateStudentProfile, updateMyProfile);
router.get("/completeness", getCompleteness);

router.patch("/personal", validateProfileSection("personal"), updatePersonal);
router.patch("/contact", validateProfileSection("contact"), updateContact);
router.patch("/academic", validateProfileSection("academic"), updateAcademic);
router.put("/skills", validateSkillsPayload, updateSkills);
router.put("/certifications", validateCertificationsPayload, updateCertifications);
router.patch("/social", validateProfileSection("social"), updateSocial);
router.put("/resume", validateResumePayload, updateResume);
router.delete("/resume", deleteResume);
router.put("/documents", validateDocumentsPayload, updateDocuments);

export default router;
