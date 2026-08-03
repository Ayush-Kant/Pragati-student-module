import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../config/sequelize.js";

export class AssessmentResult extends Model {}

AssessmentResult.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attemptId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    assessmentId: { type: DataTypes.INTEGER, allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    totalMarks: { type: DataTypes.INTEGER, allowNull: false },
    marksObtained: { type: DataTypes.FLOAT, allowNull: false },
    percentage: { type: DataTypes.FLOAT, allowNull: false },
    correctCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    incorrectCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    unansweredCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: { isIn: [["passed", "failed"]] },
    },
  },
  {
    sequelize,
    modelName: "AssessmentResult",
    tableName: "assessmentresults",
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

export default AssessmentResult;