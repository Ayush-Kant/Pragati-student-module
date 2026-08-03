import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadLogo,
  uploadSignature,
} from "../controllers/upload.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "logo") {
      cb(null, path.join(process.cwd(), "src", "uploads", "logos"));
    } else {
      cb(null, path.join(process.cwd(), "src", "uploads", "signatures"));
    }
  },

  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/logo", upload.single("logo"), uploadLogo);

router.post("/signature", upload.single("signature"), uploadSignature);

export default router;