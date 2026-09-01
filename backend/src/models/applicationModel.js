import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

export class Application extends Model {}

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
    sequelize,
    modelName: "Application",
    tableName: "job_applications",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: "idx_job_applications_student_company_title",
        unique: true,
        fields: ["student_id", "company_name", "job_title"],
      },
    ],
  }
);

export default Application;
