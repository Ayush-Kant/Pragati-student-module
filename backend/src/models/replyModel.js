import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class DiscussionReply extends Model {}

DiscussionReply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "comment_id",
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
    modelName: "DiscussionReply",
    tableName: "discussion_replies",
    underscored: true,
    timestamps: true,
  },
);

export default DiscussionReply;
