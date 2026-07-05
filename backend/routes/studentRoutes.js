import express from "express";

import {
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/profile", getStudentProfile);

router.put("/profile", updateStudentProfile);

export default router;