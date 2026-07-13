import express from "express";
import {
    getCourseModules,
    getModuleDetails,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/courses/:id/modules", getCourseModules);
router.get("/modules/:id", getModuleDetails);

export default router;