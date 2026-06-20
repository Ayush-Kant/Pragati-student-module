import * as service from "../services/companyProfile.service.js";

export const getCompanyProfile = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await service.getCompanyProfileService(companyId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await service.updateCompanyProfileService(companyId, req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyTeam = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const data = await service.getCompanyTeamService(companyId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createCompanyTeamMember = async (req, res, next) => {
  try {
    const data = await service.createCompanyTeamMemberService({
      ...req.body,
      company_id: req.user.companyId,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyTeamMember = async (req, res, next) => {
  try {
    const data = await service.updateCompanyTeamMemberService(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyTeamMember = async (req, res, next) => {
  try {
    await service.deleteCompanyTeamMemberService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
