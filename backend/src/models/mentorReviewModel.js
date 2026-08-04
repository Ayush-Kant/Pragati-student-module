import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Project from "./projectModel.js";
import ProjectSubmission from "./projectSubmissionModel.js";

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
      field: "project_id",
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
    submissionId: {
      type: DataTypes.INTEGER,
      field: "submission_id",
      allowNull: true,
      references: {
        model: ProjectSubmission,
        key: "id",
      },
    },
    mentorId: {
      type: DataTypes.INTEGER,
      field: "mentor_id",
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

Project.hasMany(MentorReview, { foreignKey: "projectId", as: "reviews", onDelete: "CASCADE" });
MentorReview.belongsTo(Project, { foreignKey: "projectId", as: "project" });

ProjectSubmission.hasMany(MentorReview, { foreignKey: "submissionId", as: "reviews", onDelete: "SET NULL" });
MentorReview.belongsTo(ProjectSubmission, { foreignKey: "submissionId", as: "submission" });

export default MentorReview;
