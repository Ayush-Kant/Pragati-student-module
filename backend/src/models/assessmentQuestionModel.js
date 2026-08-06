import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../../config/sequelize.js";

export class AssessmentQuestion extends Model {}

AssessmentQuestion.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assessmentId: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [["Technical", "Behavioural", "Aptitude", "Design"]] },
    },
    questionText: { type: DataTypes.TEXT, allowNull: true },
    // Array of option strings, e.g. ["Paris", "London", "Rome", "Berlin"]
    options: { type: DataTypes.JSONB, allowNull: true },
    // Index into `options` that is correct, e.g. 0
    correctOption: { type: DataTypes.INTEGER, allowNull: true },
    problemStatement: { type: DataTypes.TEXT, allowNull: true },
    languageSupport: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
    sampleInput: { type: DataTypes.TEXT, allowNull: true },
    sampleOutput: { type: DataTypes.TEXT, allowNull: true },
    hiddenTestCases: { type: DataTypes.JSONB, allowNull: true },
    marks: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "AssessmentQuestion",
    tableName: "assessment_questions",
    timestamps: true,
    underscored: true,
    updatedAt: false, // this table only has created_at, no updated_at
  }
);

export default AssessmentQuestion;
