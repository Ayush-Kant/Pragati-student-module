import { getAllBadges, getStudentBadges } from "../services/badge.service.js";

export const getBadges = async (req, res) => {
  try {
    const badges = await getAllBadges();
    return res.status(200).json({
      success: true,
      badges: badges || [],
    });
  } catch (error) {
    console.error("Error retrieving badges:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      badges: [],
    });
  }
};

export const getStudentBadgesController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "student id is required",
        badges: [],
      });
    }

    const badges = await getStudentBadges(parseInt(id));
    return res.status(200).json({
      success: true,
      studentId: parseInt(id),
      badges: badges || [],
    });
  } catch (error) {
    console.error("Error retrieving student badges:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      badges: [],
    });
  }
};
