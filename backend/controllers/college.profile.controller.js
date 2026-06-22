import { response } from "express";
import {createProfile, getProfile, updateProfile} from "../services/college.profile.service.js";


export const getCollegeProfile = async (req, res, next) => {
  try {
    const collegeId = req.params.id;

    const profile = await getProfile(collegeId);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};


export const updateCollegeProfile = async (req, res, next) => {
  try {
    const collegeId = req.params.id;
    const updateData = req.body;
    const updatedProfile = await updateProfile(collegeId, updateData);

    if (!updatedProfile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

export const createCollegeProfile = async (req, res, next) => {
  
  try {
    const createData = req.body;
    const userId = req.user.userId;
    createData.user_id = userId;

    const newProfile = await createProfile(createData);

    if (!newProfile) {
      return res.status(404).json({
        message: "Profile not added",
      });
    }

    return res.status(200).json({
      message: "Profile created successfully",
      newProfile
    });
  } catch (error) {
    next(error);
  }
};
