import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";

class ProjectSubmission extends Model {}

ProjectSubmission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      field: "project_id",
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
    submittedBy: {
      type: DataTypes.INTEGER,
      field: "submitted_by",
      allowNull: false,
    },
    repositoryUrl: {
      type: DataTypes.STRING,
      field: "repository_url",
      allowNull: false,
    },
    branchName: {
      type: DataTypes.STRING,
      field: "branch_name",
      allowNull: false,
      defaultValue: "main",
    },
    submissionNotes: {
      type: DataTypes.TEXT,
      field: "submission_notes",
      allowNull: true,
    },
    demoUrl: {
      type: DataTypes.STRING,
      field: "demo_url",
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "SUBMITTED",
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "ProjectSubmission",
    tableName: "project_submissions",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(ProjectSubmission, { foreignKey: "projectId", as: "submissions", onDelete: "CASCADE" });
ProjectSubmission.belongsTo(Project, { foreignKey: "projectId", as: "project" });

export default ProjectSubmission;
