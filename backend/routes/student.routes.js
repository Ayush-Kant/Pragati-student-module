import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  filterStudents,
  getStudentStatistics,
  getAcademicDetails,
  updateAcademicDetails,
  getStudentSkills,
  addStudentSkill,
  updateStudentSkill,
  removeStudentSkill
} from "../controllers/student.controller.js";

import {
  validateStudent,
  validateAcademicDetails,
  validateSkill,
  validateRequestBody
} from "../validators/studentValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(validateRequestBody);
router.use(authMiddleware);

router.get("/search", searchStudents);
router.get("/filter", filterStudents);
router.get("/statistics", roleMiddleware("admin", "staff", "company"), getStudentStatistics);

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", roleMiddleware("admin", "staff"), validateStudent, createStudent);
router.put("/:id", roleMiddleware("admin", "staff", "student"), validateStudent, updateStudent);
router.delete("/:id", roleMiddleware("admin"), deleteStudent);

router.get("/:id/academic", getAcademicDetails);
router.put("/:id/academic", roleMiddleware("admin", "staff", "student"), validateAcademicDetails, updateAcademicDetails);

router.get("/:id/skills", getStudentSkills);
router.post("/:id/skills", roleMiddleware("admin", "staff", "student"), validateSkill, addStudentSkill);
router.put("/:id/skills/:skillId", roleMiddleware("admin", "staff", "student"), validateSkill, updateStudentSkill);
router.delete("/:id/skills/:skillId", roleMiddleware("admin", "staff", "student"), removeStudentSkill);

export default router;
