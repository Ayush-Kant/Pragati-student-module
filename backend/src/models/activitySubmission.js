// ─────────────────────────────────────────────────────────────────────────────
//  src/models/activitySubmission.js
//  Sequelize model for activity_submissions table (@sequelize/core v7)
// ─────────────────────────────────────────────────────────────────────────────

import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import StudentProject from "./studentProject.js";
import ProjectMilestone from "./projectMilestone.js";
import { SUBMISSION_STATUS, SUBMISSION_TYPE } from "../constants/projectConstants.js";

class ActivitySubmission extends Model {}

ActivitySubmission.init(
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
    milestoneId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      columnName: "milestone_id",
      references: {
        model: ProjectMilestone,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      columnName: "student_id",
    },
    githubUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      columnName: "github_url",
    },
    deploymentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      columnName: "deployment_url",
    },
    progressNotes: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      columnName: "progress_notes",
    },
    reportUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      columnName: "report_url",
    },
    submissionType: {
      type: DataTypes.ENUM(SUBMISSION_TYPE.MILESTONE, SUBMISSION_TYPE.FINAL),
      allowNull: false,
      defaultValue: SUBMISSION_TYPE.MILESTONE,
      columnName: "submission_type",
    },
    status: {
      type: DataTypes.ENUM(
        SUBMISSION_STATUS.PENDING,
        SUBMISSION_STATUS.SUBMITTED,
        SUBMISSION_STATUS.REJECTED,
        SUBMISSION_STATUS.APPROVED
      ),
      allowNull: false,
      defaultValue: SUBMISSION_STATUS.SUBMITTED,
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
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      columnName: "submitted_at",
    },
  },
  {
    sequelize,
    modelName: "ActivitySubmission",
    tableName: "activity_submissions",
    underscored: true,
    timestamps: true,
  }
);

export default ActivitySubmission;
