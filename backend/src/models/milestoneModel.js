import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";

class Milestone extends Model {}

Milestone.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PENDING",
    },
    dueDate: {
      type: DataTypes.DATE,
      columnName: "due_date",
      allowNull: true,
    },
    targetDate: {
      type: DataTypes.DATE,
      columnName: "target_date",
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      columnName: "completed_at",
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Milestone",
    tableName: "project_milestones",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(Milestone, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "milestones" });
Milestone.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

export default Milestone;
