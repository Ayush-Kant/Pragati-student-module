import * as onboardingService from "../services/studentOnboarding.service.js";

export const getOnboardingState = async (req, res, next) => {
  try {
    const data = await onboardingService.getOnboardingState(req.user);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const saveOnboardingStep = async (req, res, next) => {
  try {
    const data = await onboardingService.saveOnboardingStep(
      req.user,
      req.params.stepNumber,
      req.body || {},
      req.file || null,
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export default { getOnboardingState, saveOnboardingStep };
