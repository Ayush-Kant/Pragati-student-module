import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class DiscussionReport extends Model {}

DiscussionReport.init(
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
    replyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "reply_id",
    },
    reportedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "reported_by",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "DiscussionReport",
    tableName: "discussion_reports",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["discussion_id"] },
      { fields: ["comment_id"] },
      { fields: ["reply_id"] },
      { fields: ["reported_by"] },
      { fields: ["status"] },
    ],
  },
);

export default DiscussionReport;
