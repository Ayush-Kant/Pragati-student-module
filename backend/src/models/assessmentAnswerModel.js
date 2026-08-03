import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../config/sequelize.js";

export class AssessmentAnswer extends Model {}

AssessmentAnswer.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attemptId: { type: DataTypes.INTEGER, allowNull: false },
    questionId: { type: DataTypes.INTEGER, allowNull: false },
    selectedOption: { type: DataTypes.INTEGER, allowNull: true },
    isCorrect: { type: DataTypes.BOOLEAN, allowNull: true },
    marksAwarded: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "AssessmentAnswer",
    tableName: "assessmentanswers",
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

export default AssessmentAnswer;