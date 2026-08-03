import { DataTypes, Model } from "@sequelize/core";
import { sequelize } from "../config/sequelize.js";

export class Assessment extends Model {}

Assessment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [["Technical", "Behavioural", "Aptitude", "Design"]] },
    },
    difficulty: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [["Easy", "Medium", "Hard"]] },
    },
    timeLimitMinutes: { type: DataTypes.INTEGER, allowNull: false },
    totalMarks: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "draft",
      validate: { isIn: [["draft", "active", "archived"]] },
    },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    archivedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: "Assessment",
    tableName: "assessments",
    timestamps: true,
    underscored: true,
  }
);

export default Assessment;