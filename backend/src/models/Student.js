import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class Student extends Model {}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      field: "full_name",
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    underscored: true,
    timestamps: false,
  },
);

export default Student;
