// ─────────────────────────────────────────────────────────────────────────────
//  src/models/projectMilestone.js
//  Sequelize model for project_milestones table (@sequelize/core v7)
// ─────────────────────────────────────────────────────────────────────────────

import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import StudentProject from "./studentProject.js";
import { MILESTONE_STATUS } from "../constants/projectConstants.js";

class ProjectMilestone extends Model {}

ProjectMilestone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      columnName: "project_id",
      references: {
        model: StudentProject,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        MILESTONE_STATUS.PENDING,
        MILESTONE_STATUS.IN_PROGRESS,
        MILESTONE_STATUS.SUBMITTED,
        MILESTONE_STATUS.COMPLETED
      ),
      allowNull: false,
      defaultValue: MILESTONE_STATUS.PENDING,
    },
    weightage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    modelName: "ProjectMilestone",
    tableName: "project_milestones",
    underscored: true,
    timestamps: true,
  }
);

export default ProjectMilestone;
