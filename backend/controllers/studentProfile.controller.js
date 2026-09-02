import { resolveStudentId } from "../utils/studentProfileIdentity.js";
import * as studentProfileService from "../services/studentProfile.service.js";

const sendProfile = async (req, res, operation) => {
  const studentId = await resolveStudentId(req.user);
  const profile = await operation(studentId);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }

  return res.status(200).json({ success: true, data: profile });
};

export const getMyProfile = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) => studentProfileService.getMyProfile(studentId));
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) => studentProfileService.updateMyProfile(studentId, req.body));
  } catch (error) {
    next(error);
  }
};

const updateSection = (section) => async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) =>
      studentProfileService.updateMyProfile(studentId, { [section]: req.body }),
    );
  } catch (error) {
    next(error);
  }
};

export const updatePersonal = updateSection("personal");
export const updateContact = updateSection("contact");
export const updateAcademic = updateSection("academic");

export const updateSkills = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) =>
      studentProfileService.updateMyProfile(studentId, { skills: req.body }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateCertifications = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) =>
      studentProfileService.updateMyProfile(studentId, { certifications: req.body }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateSocial = updateSection("social");

export const updateResume = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) =>
      studentProfileService.updateMyProfile(studentId, { resume: req.body }),
    );
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) =>
      studentProfileService.updateMyProfile(studentId, { resume: null }),
    );
  } catch (error) {
    next(error);
  }
};

export const updateDocuments = async (req, res, next) => {
  try {
    return await sendProfile(req, res, (studentId) =>
      studentProfileService.updateMyProfile(studentId, { documents: req.body }),
    );
  } catch (error) {
    next(error);
  }
};

export const getCompleteness = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const result = await studentProfileService.getProfileCompleteness(studentId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
