  import express from "express";

  import * as validator from "../validators/interview.validator.js";
  import * as controller from "../controllers/interview.controller.js";

  const router = express.Router();

  router.get("/", controller.getInterviews);

  router.post(
      "/",
      validator.validateCreateInterview,
      controller.createInterview
  );

  router.get(
      "/:id",
      validator.validateInterviewId,
      controller.getInterviewById
  );

 router.patch(
    "/:id/feedback",
    validator.validateInterviewId,
    validator.validateFeedback,
    controller.submitFeedback
);

router.patch(
    "/:id/result",
    validator.validateInterviewId,
    validator.validateResult,
    controller.updateResult
);

  export default router;