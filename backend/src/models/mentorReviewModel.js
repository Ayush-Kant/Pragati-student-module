import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";
import { ProjectSubmission } from "./submissionModel.js";

class MentorReview extends Model {}

MentorReview.init(
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
    submissionId: {
      type: DataTypes.INTEGER,
      columnName: "submission_id",
      allowNull: true,
      references: {
        model: ProjectSubmission,
        key: "id",
      },
    },
    mentorId: {
      type: DataTypes.INTEGER,
      columnName: "mentor_id",
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "COMPLETED",
    },
  },
  {
    sequelize,
    modelName: "MentorReview",
    tableName: "mentor_reviews",
    underscored: true,
    timestamps: true,
  }
);

Project.hasMany(MentorReview, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "reviews" });
MentorReview.belongsTo(Project, { foreignKey: { name: "projectId", onDelete: "CASCADE" }, as: "project" });

ProjectSubmission.hasMany(MentorReview, { foreignKey: { name: "submissionId", onDelete: "SET NULL" }, as: "reviews" });
MentorReview.belongsTo(ProjectSubmission, { foreignKey: { name: "submissionId", onDelete: "SET NULL" }, as: "submission" });

export default MentorReview;
