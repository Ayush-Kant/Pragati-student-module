import { response } from "express";
import {createProfile, getProfile, updateProfile} from "../services/college.profile.service.js";
import { resolveUserIntId } from "../utils/userResolver.js";


export const getCollegeProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const intUserId = await resolveUserIntId(userId);
    const profile = await getProfile(intUserId);

    if (!profile) {
      return res.status(404).json({
         success: false,
         message: "Profile not found",
         data: null,
      });
    }
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};


export const updateCollegeProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const intUserId = await resolveUserIntId(userId);
    const updateData = req.body;
    const updatedProfile = await updateProfile(intUserId, updateData);

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: null,     
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

export const createCollegeProfile = async (req, res, next) => {
  
  try {
    const createData = req.body;
    const userId = req.user.userId;
    const intUserId = await resolveUserIntId(userId);
    createData.user_id = intUserId;

    const newProfile = await createProfile(createData);

    if (!newProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not added",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile created successfully",
      newProfile
    });
  } catch (error) {
    next(error);
  }
};
