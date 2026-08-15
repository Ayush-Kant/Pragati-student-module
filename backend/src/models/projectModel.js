import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "IN_PROGRESS",
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    githubRepoUrl: {
      type: DataTypes.STRING,
      columnName: "github_repo_url",
      allowNull: true,
    },
    createdById: {
      type: DataTypes.INTEGER,
      columnName: "created_by_id",
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      columnName: "start_date",
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      columnName: "end_date",
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    underscored: true,
    timestamps: true,
  }
);

export default Project;
