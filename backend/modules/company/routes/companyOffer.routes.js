import express from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../middleware/roleMiddleware.js";
import * as offerController from "../controllers/companyOffer.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware('company'));

router.post("/", offerController.createOffer);
router.get("/", offerController.getOffers);
router.get("/:id", offerController.getOfferById);
router.patch("/:id/status", offerController.updateOfferStatus);
router.delete("/:id", offerController.deleteOffer);

export default router;
