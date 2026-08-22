import { DataTypes, Model } from "@sequelize/core";
import connectDB from "../../config/db.js";

const sequelizeInstance = connectDB.sequelize || connectDB;

export class SkillReadiness extends Model {}

try {
  if (sequelizeInstance && typeof sequelizeInstance.define === "function") {
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
        sequelize: sequelizeInstance,
        modelName: "SkillReadiness",
        tableName: "skill_readiness",
        underscored: true,
        timestamps: true,
      }
    );
  }
} catch (e) {
  // Fallback
}

export default SkillReadiness;
