import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Training from "./Training.js";
import Student from "./Student.js";

class TrainingProgress extends Model {}

TrainingProgress.init(
  {
    progressId: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "progress_id",
    },
    trainingId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "training_id",
      references: {
        model: Training,
        key: "training_id",
      },
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "candidate_id",
      references: {
        model: Student,
        key: "id",
      },
    },
    attendance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    assignmentScore: {
      type: DataTypes.INTEGER,
      field: "assignment_score",
      allowNull: true,
    },
    engagementScore: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
      field: "engagement_score",
    },
    performanceRating: {
      type: DataTypes.INTEGER,
      field: "performance_rating",
      allowNull: true,
    },
    readinessScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "readiness_score",
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "completion_date",
    },
    status: {
      type: DataTypes.ENUM("ENROLLED", "IN_PROGRESS", "COMPLETED", "DROPPED"),
      defaultValue: "ENROLLED",
    },
  },
  {
    sequelize,
    modelName: "TrainingProgress",
    tableName: "training_progress",
    underscored: true,
    hooks: {
      beforeCreate: (progress) => {
        if (!progress.progressId) {
          const timestamp = Date.now();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          progress.progressId = `TP${timestamp}${randomSuffix}`;
        }
      },
    },
  },
);

TrainingProgress.belongsTo(Training, {
  foreignKey: "trainingId",
  as: "training",
});
TrainingProgress.belongsTo(Student, {
  foreignKey: "candidateId",
  as: "candidate",
});
Training.hasMany(TrainingProgress, {
  foreignKey: "trainingId",
  as: "progressList",
});

export default TrainingProgress;
