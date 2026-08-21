import { DataTypes, Model } from "sequelize";
import connectDB from "../../config/db.js";

const sequelizeInstance = connectDB.sequelize || connectDB;

export class Application extends Model {}

try {
  if (sequelizeInstance && typeof sequelizeInstance.define === "function") {
    Application.init(
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
        companyName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "company_name",
        },
        jobTitle: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "job_title",
        },
        jobId: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "job_id",
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "APPLIED",
        },
        appliedDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "applied_date",
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        history: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: [],
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: "Application",
        tableName: "job_applications",
        underscored: true,
        timestamps: true,
      }
    );
  }
} catch (e) {
  // Fallback
}

export default Application;
