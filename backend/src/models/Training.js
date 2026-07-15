import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Company from "./Company.js";
import Mentor from "./Mentor.js";

class Training extends Model {}

Training.init(
  {
    trainingId: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "training_id",
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "company_id",
      references: {
        model: Company,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "mentor_id",
      references: {
        model: Mentor,
        key: "id",
      },
    },
    curriculum: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Training",
    tableName: "trainings",
    underscored: true,
    hooks: {
      beforeCreate: (training) => {
        if (!training.trainingId) {
          const timestamp = Date.now();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          training.trainingId = `T${timestamp}${randomSuffix}`;
        }
      },
    },
  },
);

Training.belongsTo(Company, { foreignKey: "companyId", as: "company" });
Training.belongsTo(Mentor, { foreignKey: "mentorId", as: "mentor" });

export default Training;
