// sequelize Op imported only if needed for future queries
import sequelize from "../config/sequelize.js";
import Training from "../src/models/Training.js";
import TrainingProgress from "../src/models/TrainingProgress.js";
import MentorFeedback from "../src/models/MentorFeedback.js";
import Mentor from "../src/models/Mentor.js";
import User from "../src/models/User.js";
import Student from "../src/models/Student.js";

export class TrainingService {
  /**
   * List all training programs for a company with filters and pagination
   */
  static async getTrainingPrograms(companyId, filters = {}) {
    const { status, limit = 10, offset = 0 } = filters;
    const whereClause = { companyId };

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Training.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM training_progress 
              WHERE training_progress.training_id = "Training".training_id
            )`),
            "candidatesEnrolled",
          ],
        ],
      },
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["fullName", "email"],
            },
          ],
        },
      ],
    });

    const data = rows.map((row) => {
      const plain = row.get({ plain: true });
      return {
        trainingId: plain.trainingId,
        title: plain.title,
        status: plain.status,
        mentorAssigned: !!plain.mentor,
        mentor: plain.mentor
          ? {
              mentorId: plain.mentor.id,
              name: plain.mentor.user ? plain.mentor.user.fullName : null,
              email: plain.mentor.user ? plain.mentor.user.email : null,
            }
          : null,
        candidatesEnrolled: plain.candidatesEnrolled || 0,
        startDate: plain.startDate,
        endDate: plain.endDate,
      };
    });

    return {
      data,
      pagination: {
        total: count,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    };
  }

  /**
   * Get detailed information about a training program
   */
  static async getTrainingById(trainingId, companyId) {
    const training = await Training.findOne({
      where: { trainingId, companyId },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)::int 
              FROM training_progress 
              WHERE training_progress.training_id = "Training".training_id
            )`),
            "enrolledCandidates",
          ],
        ],
      },
      include: [
        {
          model: Mentor,
          as: "mentor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["fullName", "email"],
            },
          ],
        },
      ],
    });

    if (!training) {
      throw new Error("Training not found");
    }

    const plain = training.get({ plain: true });
    return {
      trainingId: plain.trainingId,
      title: plain.title,
      description: plain.description,
      duration: plain.duration,
      startDate: plain.startDate,
      endDate: plain.endDate,
      mentor: plain.mentor
        ? {
            mentorId: plain.mentor.id,
            name: plain.mentor.user ? plain.mentor.user.fullName : null,
            email: plain.mentor.user ? plain.mentor.user.email : null,
          }
        : null,
      enrolledCandidates: plain.enrolledCandidates || 0,
      curriculum: plain.curriculum || [],
      status: plain.status,
    };
  }

  /**
   * Assign or update mentor for a training program
   */
  static async assignMentor(trainingId, mentorId, companyId) {
    const training = await Training.findOne({ where: { trainingId, companyId } });
    if (!training) {
      const err = new Error("Training not found");
      err.status = 404;
      throw err;
    }

    const numericMentorId =
      typeof mentorId === "string" && mentorId.startsWith("M")
        ? parseInt(mentorId.substring(1), 10)
        : parseInt(mentorId, 10);

    const mentor = await Mentor.findByPk(numericMentorId);
    if (!mentor) {
      const err = new Error("Mentor not found");
      err.status = 404;
      throw err;
    }

    training.mentorId = numericMentorId;
    await training.save();

    return { success: true, message: "Mentor assigned successfully" };
  }

  /**
   * Calculate readiness score for a candidate
   */
  static async calculateReadinessScore(candidateId, trainingId) {
    const progress = await TrainingProgress.findOne({
      where: { candidateId, trainingId },
    });

    if (!progress) {
      throw new Error("Training progress not found");
    }

    const attendance = progress.attendance || 0;
    const assignmentScore = progress.assignmentScore || 0;
    const engagementScore = progress.engagementScore || 0.0;

    const readinessScore = Math.round(
      attendance * 0.3 + assignmentScore * 0.4 + engagementScore * 0.3
    );

    progress.readinessScore = readinessScore;
    await progress.save();

    return readinessScore;
  }

  /**
   * Get training progress analytics and performance metrics
   */
  static async getProgressAnalytics(trainingId, companyId) {
    const training = await Training.findOne({ where: { trainingId, companyId } });
    if (!training) {
      const err = new Error("Training not found");
      err.status = 404;
      throw err;
    }

    const progressList = await TrainingProgress.findAll({
      where: { trainingId },
      include: [
        {
          model: Student,
          as: "candidate",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    const totalCandidates = progressList.length;
    if (totalCandidates === 0) {
      return {
        trainingId,
        title: training.title,
        totalCandidates: 0,
        completionPercentage: 0,
        attendanceRate: 0,
        assignmentSubmissions: { completed: 0, pending: 0 },
        engagementScore: 0,
        performanceMetrics: { average: 0, highest: 0, lowest: 0 },
        mentorFeedback: null,
        atRiskCandidates: [],
      };
    }

    const completedCandidates = progressList.filter(
      (p) => p.status === "COMPLETED"
    ).length;
    const completionPercentage = Math.round(
      (completedCandidates / totalCandidates) * 100
    );

    const totalAttendance = progressList.reduce((sum, p) => sum + (p.attendance || 0), 0);
    const attendanceRate = Math.round(totalAttendance / totalCandidates);

    const totalEngagement = progressList.reduce((sum, p) => sum + (p.engagementScore || 0.0), 0);
    const engagementScore = parseFloat((totalEngagement / totalCandidates).toFixed(1));

    // Performance ratings
    const performanceRatings = progressList
      .map((p) => p.performanceRating)
      .filter((r) => r !== null && r !== undefined);

    const averageRating = performanceRatings.length
      ? Math.round(performanceRatings.reduce((sum, r) => sum + r, 0) / performanceRatings.length)
      : 0;
    const highestRating = performanceRatings.length ? Math.max(...performanceRatings) : 0;
    const lowestRating = performanceRatings.length ? Math.min(...performanceRatings) : 0;

    // At-risk candidates (readiness score < 50)
    // We should first calculate/update readiness score to be accurate
    const atRiskCandidates = [];
    for (const p of progressList) {
      const readiness = p.readinessScore || 0;
      if (readiness < 50) {
        atRiskCandidates.push(String(p.candidateId)); // Use string representation of Candidate ID
      }
    }

    // Get latest mentor feedback message
    const latestFeedback = await MentorFeedback.findOne({
      where: { trainingId },
      order: [["created_at", "DESC"]],
      attributes: ["feedback"],
    });

    // Submissions:
    // Completed submissions = assignmentScore is set
    // Pending submissions = assignmentScore is null/not set
    const completedSubmissions = progressList.filter(
      (p) => p.assignmentScore !== null && p.assignmentScore !== undefined
    ).length;
    const pendingSubmissions = totalCandidates - completedSubmissions;

    return {
      trainingId,
      title: training.title,
      totalCandidates,
      completionPercentage,
      attendanceRate,
      assignmentSubmissions: {
        completed: completedSubmissions,
        pending: pendingSubmissions,
      },
      engagementScore,
      performanceMetrics: {
        average: averageRating,
        highest: highestRating,
        lowest: lowestRating,
      },
      mentorFeedback: latestFeedback ? latestFeedback.feedback : null,
      atRiskCandidates,
    };
  }

  /**
   * Update candidate progress and auto-recalculate readiness score
   */
  static async updateCandidateProgress(candidateId, trainingId, updateData) {
    const progress = await TrainingProgress.findOne({
      where: { candidateId, trainingId },
    });

    if (!progress) {
      throw new Error("Progress record not found");
    }

    const {
      attendance,
      assignmentScore,
      engagementScore,
      performanceRating,
      status,
      completionDate,
    } = updateData;

    if (attendance !== undefined) progress.attendance = attendance;
    if (assignmentScore !== undefined) progress.assignmentScore = assignmentScore;
    if (engagementScore !== undefined) progress.engagementScore = engagementScore;
    if (performanceRating !== undefined) progress.performanceRating = performanceRating;
    if (status !== undefined) progress.status = status;
    if (completionDate !== undefined) progress.completionDate = completionDate;

    await progress.save();

    // Auto-recalculate readiness score if inputs changed
    if (
      attendance !== undefined ||
      assignmentScore !== undefined ||
      engagementScore !== undefined
    ) {
      await this.calculateReadinessScore(candidateId, trainingId);
    }

    return { success: true, message: "Progress updated successfully" };
  }
}

export default TrainingService;
