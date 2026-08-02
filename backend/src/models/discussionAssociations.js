import Discussion from "./discussionModel.js";
import DiscussionComment from "./commentModel.js";
import DiscussionReply from "./replyModel.js";
import DiscussionReaction from "./reactionModel.js";
import DiscussionReport from "./reportModel.js";

const initializeDiscussionAssociations = () => {
  Discussion.hasMany(DiscussionComment, { foreignKey: "discussion_id", as: "comments" });
  DiscussionComment.belongsTo(Discussion, { foreignKey: "discussion_id", as: "discussion" });
  DiscussionComment.hasMany(DiscussionReply, { foreignKey: "comment_id", as: "replies" });
  DiscussionReply.belongsTo(DiscussionComment, { foreignKey: "comment_id", as: "comment" });
  Discussion.hasMany(DiscussionReaction, { foreignKey: "discussion_id", as: "reactions" });
  DiscussionComment.hasMany(DiscussionReaction, { foreignKey: "comment_id", as: "reactions" });
  Discussion.hasMany(DiscussionReport, { foreignKey: "discussion_id", as: "reports" });
  DiscussionComment.hasMany(DiscussionReport, { foreignKey: "comment_id", as: "reports" });
  DiscussionReply.hasMany(DiscussionReport, { foreignKey: "reply_id", as: "reports" });
};

initializeDiscussionAssociations();

export default initializeDiscussionAssociations;
