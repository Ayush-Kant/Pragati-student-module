import { DataTypes, Model } from "@sequelize/core";
import connectDB from "../../config/db.js";

const sequelizeInstance = connectDB.sequelize || connectDB;

export class PlacementProfile extends Model {}

try {
  if (sequelizeInstance && typeof sequelizeInstance.define === "function") {
    PlacementProfile.init(
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
        resumeUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "resume_url",
        },
        portfolioUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "portfolio_url",
        },
        linkedinUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "linkedin_url",
        },
        githubUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "github_url",
        },
        readinessScore: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: "readiness_score",
        },
        placementStatus: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "NOT_PLACED",
          field: "placement_status",
        },
        preferredRole: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "preferred_role",
        },
        targetSalary: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          field: "target_salary",
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: "PlacementProfile",
        tableName: "placement_profiles",
        underscored: true,
        timestamps: true,
      }
    );
  }
} catch (e) {
  // Fallback
}

export default PlacementProfile;
