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
      columnName: "project_id",
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
    submittedBy: {
      type: DataTypes.INTEGER,
      columnName: "submitted_by",
      allowNull: false,
    },
    repositoryUrl: {
      type: DataTypes.STRING,
      columnName: "repository_url",
      allowNull: false,
    },
    branchName: {
      type: DataTypes.STRING,
      columnName: "branch_name",
      allowNull: false,
      defaultValue: "main",
    },
    submissionNotes: {
      type: DataTypes.TEXT,
      columnName: "submission_notes",
      allowNull: true,
    },
    demoUrl: {
      type: DataTypes.STRING,
      columnName: "demo_url",
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

Project.hasMany(ProjectSubmission, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "submissions" });
ProjectSubmission.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

export default ProjectSubmission;
