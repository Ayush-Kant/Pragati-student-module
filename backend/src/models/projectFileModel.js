import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";

class ProjectFile extends Model {}

ProjectFile.init(
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
    uploadedBy: {
      type: DataTypes.INTEGER,
      field: "uploaded_by",
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      field: "file_name",
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      field: "original_name",
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      field: "file_path",
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      field: "file_size",
      allowNull: true,
    },
    fileType: {
      type: DataTypes.STRING,
      field: "file_type",
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ProjectFile",
    tableName: "project_files",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(ProjectFile, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "files" });
ProjectFile.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

export default ProjectFile;
