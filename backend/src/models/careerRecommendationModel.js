import { DataTypes, Model } from "@sequelize/core";
import connectDB from "../../config/db.js";

const sequelizeInstance = connectDB.sequelize || connectDB;

export class CareerRecommendation extends Model {}

try {
  if (sequelizeInstance && typeof sequelizeInstance.define === "function") {
    CareerRecommendation.init(
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        priority: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "MEDIUM",
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        currentState: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "current_state",
        },
        targetState: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "target_state",
        },
        recommendedAction: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: "recommended_action",
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: "CareerRecommendation",
        tableName: "career_recommendations",
        underscored: true,
        timestamps: true,
      }
    );
  }
} catch (e) {
  // Fallback
}

export default CareerRecommendation;
