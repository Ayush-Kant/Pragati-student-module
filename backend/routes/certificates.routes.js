import { Router } from "express";
import {
  generateCertificate,
  getCertificate,
  verifyCertificate,
  revokeCertificate,
} from "../controllers/certificates.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/verify/:uuid", verifyCertificate);

router.get("/:id", authMiddleware, getCertificate);

router.post(
  "/generate",
  authMiddleware,
  roleMiddleware("mentor", "admin"),
  generateCertificate,
);

router.patch(
  "/:id/revoke",
  authMiddleware,
  roleMiddleware("admin"),
  revokeCertificate,
);

export default router;
