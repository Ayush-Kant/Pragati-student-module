import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class Discussion extends Model {}

Discussion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_by",
    },
  },
  {
    sequelize,
    modelName: "Discussion",
    tableName: "discussions",
    underscored: true,
    timestamps: true,
  },
);

export default Discussion;
