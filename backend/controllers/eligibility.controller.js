import * as EligibilityService from "../services/eligibilityService.js";

export const getEligibility = async (req, res, next) => {
  try {
    const eligibility = await EligibilityService.getEligibility(req.params.id);
    res.status(200).json(eligibility);
  } catch (error) {
    next(error);
  }
};

export const createEligibility = async (req, res, next) => {
  try {
    const newEligibility = await EligibilityService.addEligibility(req.params.id, req.body);
    res.status(201).json(newEligibility);
  } catch (error) {
    next(error);
  }
};

export const updateEligibility = async (req, res, next) => {
  try {
    const updatedEligibility = await EligibilityService.updateEligibility(req.params.id, req.body);
    res.status(200).json(updatedEligibility);
  } catch (error) {
    next(error);
  }
};

export const deleteEligibility = async (req, res, next) => {
  try {
    const deleted = await EligibilityService.removeEligibility(req.params.id);
    res.status(200).json({ message: "Eligibility deleted successfully", data: deleted });
  } catch (error) {
    next(error);
  }
};
