import express from "express";
import {
    getResources,
    downloadResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.get("/resources", getResources);
router.get("/resources/:id/download", downloadResource);

export default router;