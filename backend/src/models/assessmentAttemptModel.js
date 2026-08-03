import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../config/sequelize.js";

export class AssessmentAttempt extends Model {}

AssessmentAttempt.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assessmentId: { type: DataTypes.INTEGER, allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "in_progress",
      validate: { isIn: [["in_progress", "submitted", "expired"]] },
    },
    startedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    submittedAt: { type: DataTypes.DATE, allowNull: true },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "AssessmentAttempt",
    tableName: "assessment_attempts",
    timestamps: true,
    underscored: true,
  }
);

export default AssessmentAttempt;