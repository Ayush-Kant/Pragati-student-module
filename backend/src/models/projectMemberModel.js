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
      field: "project_id",
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      field: "student_id",
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

Project.hasMany(ProjectMember, { foreignKey: "projectId", as: "members", onDelete: "CASCADE" });
ProjectMember.belongsTo(Project, { foreignKey: "projectId", as: "project" });

export default ProjectMember;
