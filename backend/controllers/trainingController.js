import TrainingService from "../services/trainingService.js";
import { pool } from "../config/db.js";

const getCompanyIdFromUser = async (user) => {
  if (!user) return 1;
  if (user.companyId) return user.companyId;

  try {
    const result = await pool.query(
      `SELECT c.id 
       FROM companies c
       JOIN users u ON c.user_id = u.id
       JOIN auth_users au ON u.auth_user_id = au.id
       WHERE au.uuid_id = $1`,
      [user.userId]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }
  } catch (error) {
    console.error("Error resolving companyId from user:", error);
  }

  // Default fallback for testing / local development
  return 1;
};

export class TrainingController {
  static async getTrainingPrograms(req, res) {
    try {
      const companyId = await getCompanyIdFromUser(req.user);
      // req.validatedQuery has Joi-validated + defaulted values; fall back to req.query
      const q = req.validatedQuery || req.query;
      const filters = {
        status: q.status,
        limit: q.limit,
        offset: q.offset,
      };

      const result = await TrainingService.getTrainingPrograms(companyId, filters);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error in getTrainingPrograms:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching training programs",
        error: error.message,
        stack: error.stack,
      });
    }
  }

  static async getTrainingById(req, res) {
    try {
      const companyId = await getCompanyIdFromUser(req.user);
      const { id: trainingId } = req.params;

      const data = await TrainingService.getTrainingById(trainingId, companyId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error in getTrainingById:", error);
      if (error.message === "Training not found") {
        return res.status(404).json({
          success: false,
          message: "Training not found",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error fetching training program details",
      });
    }
  }

  static async assignMentor(req, res) {
    try {
      const companyId = await getCompanyIdFromUser(req.user);
      const { id: trainingId } = req.params;
      const { mentorId } = req.body;

      const result = await TrainingService.assignMentor(trainingId, mentorId, companyId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in assignMentor:", error);
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message || "Error assigning mentor",
      });
    }
  }

  static async getProgressAnalytics(req, res) {
    try {
      const companyId = await getCompanyIdFromUser(req.user);
      const { id: trainingId } = req.params;

      const data = await TrainingService.getProgressAnalytics(trainingId, companyId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error in getProgressAnalytics:", error);
      const status = error.status || 500;
      return res.status(status).json({
        success: false,
        message: error.message || "Error fetching training progress",
      });
    }
  }

  static async getMentors(req, res) {
    try {
      const result = await pool.query(
        `SELECT id AS "mentorId", name, email 
         FROM mentors 
         WHERE is_active = true 
         ORDER BY name ASC`
      );
      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error in getMentors:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching mentors list",
      });
    }
  }
}

export default TrainingController;
