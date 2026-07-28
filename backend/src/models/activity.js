// ─────────────────────────────────────────────────────────────────────────────
//  src/models/activity.js
//  Sequelize model for activities table (@sequelize/core v7)
// ─────────────────────────────────────────────────────────────────────────────

import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class Activity extends Model {}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "PROJECT",
      columnName: "activity_type",
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Activity",
    tableName: "activities",
    underscored: true,
    timestamps: true,
  }
);

export default Activity;
