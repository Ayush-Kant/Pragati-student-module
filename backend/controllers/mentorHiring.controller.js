import {
  updateCourseHiringRelevantService,
  updateProjectHiringRelevantService,
  updateDriveSkillsService,
  updateReadinessThresholdService,
  shortlistStudentService,
  saveRecommendationService,
  getShortlistedStudentsService,
} from "../services/mentorHiring.service.js";

const handle = (serviceFn) => async (req, res) => {
  try {
    const result = await serviceFn({ userId: req.user.uid, ...req.params, ...req.body });
    return res.status(result.status).json(
      result.status === 200
        ? { success: true, ...result.data }
        : { success: false, message: result.message }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCourseHiringRelevant = handle(({ userId, id, hiringRelevant }) =>
  updateCourseHiringRelevantService({ userId, courseId: id, hiringRelevant })
);

export const updateProjectHiringRelevant = handle(({ userId, id, hiringRelevant }) =>
  updateProjectHiringRelevantService({ userId, projectId: id, hiringRelevant })
);

export const updateDriveSkills = handle(({ userId, id, requiredSkills }) =>
  updateDriveSkillsService({ userId, driveId: id, requiredSkills })
);

export const updateReadinessThreshold = handle(({ userId, id, minimumReadinessScore }) =>
  updateReadinessThresholdService({ userId, driveId: id, minimumReadinessScore })
);

export const shortlistStudent = handle(({ userId, id, shortlisted }) =>
  shortlistStudentService({ userId, studentId: id, shortlisted })
);

export const saveRecommendation = handle(({ userId, id, recommendation }) =>
  saveRecommendationService({ userId, studentId: id, recommendation })
);

export const getShortlistedStudents = async (req, res) => {
  try {
    const result = await getShortlistedStudentsService({ userId: req.user.uid });
    if (result.status !== 200)
      return res.status(result.status).json({ success: false, message: result.message });
    return res.status(200).json({ success: true, students: result.data ?? [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
