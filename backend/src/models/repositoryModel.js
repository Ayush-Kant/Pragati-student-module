import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";

class ProjectRepository extends Model {}

ProjectRepository.init(
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
    repoUrl: {
      type: DataTypes.STRING,
      columnName: "repo_url",
      allowNull: false,
    },
    repoName: {
      type: DataTypes.STRING,
      columnName: "repo_name",
      allowNull: true,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "main",
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      columnName: "is_private",
      defaultValue: false,
    },
    openIssues: {
      type: DataTypes.INTEGER,
      columnName: "open_issues",
      defaultValue: 0,
    },
    stars: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    forks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      columnName: "last_synced_at",
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectRepository",
    tableName: "project_repositories",
    underscored: true,
    timestamps: true,
  }
);

Project.hasOne(ProjectRepository, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "repository" });
ProjectRepository.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

export default ProjectRepository;
