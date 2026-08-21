import { DataTypes, Model } from "sequelize";
import connectDB from "../../config/db.js";

const sequelizeInstance = connectDB.sequelize || connectDB;

export class InterviewRound extends Model {}

try {
  if (sequelizeInstance && typeof sequelizeInstance.define === "function") {
    InterviewRound.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        interviewId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "interview_id",
        },
        roundName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "round_name",
        },
        roundOrder: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          field: "round_order",
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "SCHEDULED",
        },
        scheduledAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "scheduled_at",
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "completed_at",
        },
        feedback: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        score: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: "InterviewRound",
        tableName: "interview_rounds",
        underscored: true,
        timestamps: true,
      }
    );
  }
} catch (e) {
  // Fallback
}

export default InterviewRound;
