import ProjectMember from "../models/projectMemberModel.js";
import Project from "../models/projectModel.js";

/**
 * Middleware to restrict route access by user system role (e.g., STUDENT, MENTOR, ADMIN)
 * @param {...string} allowedRoles 
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required.",
      });
    }

    const userRole = (req.user.role || "").toUpperCase();
    const hasRole = allowedRoles.some(
      (role) => role.toUpperCase() === userRole
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

/**
 * Middleware to ensure the authenticated user is a member/creator of the project or a mentor/admin
 */
export const authorizeProjectMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required.",
      });
    }

    const userId = req.user.id;
    const userRole = (req.user.role || "").toUpperCase();
    const { projectId } = req.params;

    if (!projectId) {
      return next();
    }

    // Mentors and admins always have access
    if (userRole === "MENTOR" || userRole === "ADMIN") {
      return next();
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Project not found.",
      });
    }

    if (Number(project.createdById) === Number(userId)) {
      return next();
    }

    const member = await ProjectMember.findOne({
      where: {
        projectId,
        studentId: userId,
      },
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Access denied. You are not a member of this project.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to ensure the user is the project leader/creator or mentor/admin
 */
export const authorizeProjectLeader = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required.",
      });
    }

    const userId = req.user.id;
    const userRole = (req.user.role || "").toUpperCase();
    const { projectId } = req.params;

    if (userRole === "MENTOR" || userRole === "ADMIN") {
      return next();
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Project not found.",
      });
    }

    if (Number(project.createdById) === Number(userId)) {
      return next();
    }

    const member = await ProjectMember.findOne({
      where: {
        projectId,
        studentId: userId,
        role: "LEADER",
      },
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Only project leaders or mentors can perform this action.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  requireRole,
  authorizeProjectMember,
  authorizeProjectLeader,
};
