import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";

class ProjectActivity extends Model {}

ProjectActivity.init(
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
    userId: {
      type: DataTypes.INTEGER,
      columnName: "user_id",
      allowNull: false,
    },
    activityType: {
      type: DataTypes.STRING,
      columnName: "activity_type",
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectActivity",
    tableName: "project_activities",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(ProjectActivity, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "activities" });
ProjectActivity.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

export default ProjectActivity;
