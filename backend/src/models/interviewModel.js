import { DataTypes, Model } from "@sequelize/core";
import connectDB from "../../config/db.js";

const sequelizeInstance = connectDB.sequelize || connectDB;

export class Interview extends Model {}

try {
  if (sequelizeInstance && typeof sequelizeInstance.define === "function") {
    Interview.init(
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
        applicationId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "application_id",
        },
        companyName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "company_name",
        },
        jobTitle: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "job_title",
        },
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "date_time",
        },
        location: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: "Online",
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "TECHNICAL",
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "SCHEDULED",
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
        modelName: "Interview",
        tableName: "placement_interviews",
        underscored: true,
        timestamps: true,
      }
    );
  }
} catch (e) {
  // Fallback
}

export default Interview;
