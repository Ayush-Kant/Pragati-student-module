import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";
import Milestone from "./milestoneModel.js";

class Task extends Model {}

Task.init(
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
    milestoneId: {
      type: DataTypes.INTEGER,
      columnName: "milestone_id",
      allowNull: true,
      references: {
        model: Milestone,
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
    assignedTo: {
      type: DataTypes.INTEGER,
      columnName: "assigned_to",
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TODO",
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "MEDIUM",
    },
    dueDate: {
      type: DataTypes.DATE,
      columnName: "due_date",
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
    modelName: "Task",
    tableName: "project_tasks",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(Task, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "tasks" });
Task.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

Milestone.hasMany(Task, { foreignKey: { name: "milestoneId", onDelete: "SET NULL" }, as: "tasks" });
Task.belongsTo(Milestone, { foreignKey: { name: "milestoneId", onDelete: "SET NULL" }, as: "milestone" });

export default Task;
