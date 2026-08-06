import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class DiscussionComment extends Model {}

DiscussionComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    discussionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "discussion_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DiscussionComment",
    tableName: "discussion_comments",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["discussion_id"] },
      { fields: ["user_id"] },
      { fields: ["created_at"] },
    ],
  },
);

export default DiscussionComment;
