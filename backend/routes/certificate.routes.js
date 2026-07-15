import express from "express";
import {
  getTemplate,
  saveTemplate,
  updateTemplate,
} from "../controllers/certificate.controller.js";

const router = express.Router();

router.get("/template", getTemplate);
router.post("/template", saveTemplate);
router.put("/template/:id", updateTemplate);

export default router;