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

export const getCompanySettings = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const data = await service.getCompanyProfileService(companyId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      companyName: data.name,
      industry: data.industry || "",
      website: data.website || "",
      contactEmail: data.email || "",
      companyAddress: data.location || "",
      defaultWorkMode: data.default_work_mode || "Hybrid",
      probationPeriod: data.probation_period || 3,
      noticePeriod: data.notice_period || 30,
      currency: data.currency || "INR",
      companyLogo: data.logo_url || null,
      notifications: data.notifications || {
        emailNotifications: true,
        interviewReminders: true,
        weeklyAnalyticsReport: false,
        offerNotifications: true,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanySettings = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const body = req.body;

    const updateData = {
      name: body.companyName,
      website: body.website,
      industry: body.industry,
      size: body.size || "10-50",
      description: body.description || "",
      location: body.companyAddress,
      logo_url: body.companyLogo,
      default_work_mode: body.defaultWorkMode,
      probation_period: body.probationPeriod,
      notice_period: body.noticePeriod,
      currency: body.currency,
      notifications: body.notifications
    };

    const updated = await service.updateCompanyProfileService(companyId, updateData);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCompanyLogo = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&auto=format"
    });
  } catch (error) {
    next(error);
  }
};
