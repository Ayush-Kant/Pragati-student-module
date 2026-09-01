import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

export class SkillReadiness extends Model {}

SkillReadiness.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "student_id",
    },
    skillName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "skill_name",
    },
    currentScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "current_score",
    },
    targetScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 80,
      field: "target_score",
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "MEDIUM",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Technical",
    },
    lastEvaluatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "last_evaluated_at",
    },
  },
  {
    sequelize,
    modelName: "SkillReadiness",
    tableName: "skill_readiness",
    underscored: true,
    timestamps: true,
  }
);

export default SkillReadiness;
