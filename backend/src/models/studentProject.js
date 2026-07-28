// ─────────────────────────────────────────────────────────────────────────────
//  src/models/studentProject.js
//  Sequelize model for student_projects table (@sequelize/core v7)
// ─────────────────────────────────────────────────────────────────────────────

import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import { PROJECT_STATUS } from "../constants/projectConstants.js";

class StudentProject extends Model {}

StudentProject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      columnName: "student_id",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    repositoryUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      columnName: "repository_url",
    },
    deploymentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      columnName: "deployment_url",
    },
    reportUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      columnName: "report_url",
    },
    status: {
      type: DataTypes.ENUM(
        PROJECT_STATUS.PENDING,
        PROJECT_STATUS.IN_PROGRESS,
        PROJECT_STATUS.SUBMITTED,
        PROJECT_STATUS.APPROVED,
        PROJECT_STATUS.REJECTED
      ),
      allowNull: false,
      defaultValue: PROJECT_STATUS.PENDING,
    },
    totalScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      columnName: "total_score",
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rubricScores: {
      type: DataTypes.JSONB,
      allowNull: true,
      columnName: "rubric_scores",
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "StudentProject",
    tableName: "student_projects",
    underscored: true,
    timestamps: true,
  }
);

export default StudentProject;
