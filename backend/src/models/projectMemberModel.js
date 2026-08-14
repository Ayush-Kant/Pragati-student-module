import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";

class ProjectMember extends Model {}

ProjectMember.init(
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
    studentId: {
      type: DataTypes.INTEGER,
      columnName: "student_id",
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "MEMBER",
    },
  },
  {
    sequelize,
    modelName: "ProjectMember",
    tableName: "project_members",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(ProjectMember, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "members" });
ProjectMember.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

export default ProjectMember;
