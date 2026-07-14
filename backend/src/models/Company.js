import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class Company extends Model {}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Company",
    tableName: "companies",
    underscored: true,
    timestamps: false,
  },
);

export default Company;
