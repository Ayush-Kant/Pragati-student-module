import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import User from "./User.js";

class Mentor extends Model {}

Mentor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
    },
    bio: {
      type: DataTypes.TEXT,
    },
    expertiseTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      field: "expertise_tags",
    },
  },
  {
    sequelize,
    modelName: "Mentor",
    tableName: "mentors",
    underscored: true,
    timestamps: false,
  },
);

Mentor.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Mentor;
