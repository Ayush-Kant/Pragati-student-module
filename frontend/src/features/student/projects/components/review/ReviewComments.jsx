import React, { useState } from "react";
import { MessageSquare, Send, CornerDownRight } from "lucide-react";
import { formatDate } from "../../utils/projectHelpers";

export const ReviewComments = ({ comments = [], onAddReply }) => {
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(replyText);
    setReplyText("");
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-surface-900 dark:text-white flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Mentor Feedback & Conversation</span>
        </h3>
        <span className="text-xs text-surface-500">{comments.length} Comments</span>
      </div>

      {/* List of comments */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => {
          const isStudent = comment.type === "STUDENT_REPLY";

          return (
            <div
              key={comment.id}
              className={`p-4 rounded-xl border transition-all ${
                isStudent
                  ? "bg-brand-50/50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800/60 ml-4 sm:ml-8"
                  : "bg-surface-50 dark:bg-surface-900/50 border-surface-200 dark:border-surface-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-300 dark:ring-surface-600"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-surface-900 dark:text-white">
                        {comment.author.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-semibold rounded ${
                          isStudent
                            ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {comment.author.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-surface-400 dark:text-surface-500">
                      {formatDate(comment.timestamp, true)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-surface-700 dark:text-surface-300 leading-relaxed pl-11">
                {comment.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reply Input */}
      {onAddReply && (
        <form onSubmit={handleReplySubmit} className="pt-4 border-t border-surface-100 dark:border-surface-700">
          <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-2">
            Reply to Mentor
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ask a clarifying question or respond to feedback..."
              className="flex-1 px-4 py-2.5 bg-surface-50 dark:bg-surface-900/60 border border-surface-300 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewComments;
