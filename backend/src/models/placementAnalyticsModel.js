import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

export class PlacementAnalytics extends Model {}

PlacementAnalytics.init(
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
    totalApplications: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "total_applications",
    },
    shortlistedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "shortlisted_count",
    },
    interviewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "interview_count",
    },
    selectedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "selected_count",
    },
    readinessScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "readiness_score",
    },
    metricsJson: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "metrics_json",
    },
    calculatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "calculated_at",
    },
  },
  {
    sequelize,
    modelName: "PlacementAnalytics",
    tableName: "placement_analytics",
    underscored: true,
    timestamps: true,
  }
);

export default PlacementAnalytics;
