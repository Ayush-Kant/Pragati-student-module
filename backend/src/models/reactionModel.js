import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class DiscussionReaction extends Model {}

DiscussionReaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    discussionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "discussion_id",
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "comment_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "like",
    },
  },
  {
    sequelize,
    modelName: "DiscussionReaction",
    tableName: "discussion_reactions",
    underscored: true,
    timestamps: true,
    indexes: [
      { unique: true, fields: ["discussion_id", "user_id", "type"] },
      { unique: true, fields: ["comment_id", "user_id", "type"] },
      { fields: ["user_id"] },
      { fields: ["type"] },
    ],
  },
);

export default DiscussionReaction;
