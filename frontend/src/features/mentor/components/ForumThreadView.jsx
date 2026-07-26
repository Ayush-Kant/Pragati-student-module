import React from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  CornerDownRight, 
  Bookmark, 
  MessageSquare, 
  User, 
  Award 
} from "lucide-react";

export default function ForumThreadView({ thread, onVote }) {
  if (!thread) {
    return (
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 h-[calc(100vh-170px)]">
        <MessageSquare className="w-16 h-16 text-slate-200 mb-3 stroke-[1.5]" />
        <h3 className="text-lg font-semibold text-slate-600">No Thread Selected</h3>
        <p className="text-sm text-slate-400 mt-1">Select a discussion thread from the sidebar to view replies.</p>
      </div>
    );
  }

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case "assignments":
      case "assignment":
        return "bg-blue-600 text-white";
      case "projects":
      case "project":
        return "bg-amber-600 text-white";
      case "quizzes":
      case "quiz":
        return "bg-purple-600 text-white";
      case "general":
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-170px)] overflow-hidden">
      {/* Thread Header */}
      <div className="p-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${getCategoryBadgeClass(thread.category)}`}>
            {thread.category}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Started by <span className="font-semibold text-slate-600">{thread.startedBy}</span> • {thread.startedAt}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug mb-3">
          {thread.title}
        </h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          {thread.description}
        </p>
      </div>

      {/* Posts & Replies Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-slate-50/30">
        {thread.posts?.map((post) => {
          const isUpvoted = post.voted === "up";
          const isDownvoted = post.voted === "down";

          return (
            <div key={post.id} className="flex gap-4 items-start">
              {/* Upvote/Downvote Column */}
              <div className="flex flex-col items-center gap-1 py-2 px-1.5 bg-slate-100/60 rounded-lg border border-slate-200/50 flex-shrink-0 select-none">
                <button
                  onClick={() => onVote(thread.id, post.id, "up")}
                  className={`p-1 rounded hover:bg-slate-200/70 transition-colors ${
                    isUpvoted ? "text-blue-600" : "text-slate-400"
                  }`}
                  title="Upvote"
                >
                  <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                </button>
                <span className={`text-xs font-bold ${
                  isUpvoted ? "text-blue-600" : isDownvoted ? "text-red-500" : "text-slate-600"
                }`}>
                  {post.votes}
                </span>
                <button
                  onClick={() => onVote(thread.id, post.id, "down")}
                  className={`p-1 rounded hover:bg-slate-200/70 transition-colors ${
                    isDownvoted ? "text-red-500" : "text-slate-400"
                  }`}
                  title="Downvote"
                >
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Main Content Card */}
              <div className="flex-1 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:shadow-md/5 transition-all p-4 md:p-5 flex flex-col gap-3">
                {/* Author Card Info */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar Placeholder */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm ${
                      post.isMentor 
                        ? "bg-blue-600 text-white" 
                        : post.isAnonymous 
                        ? "bg-slate-200 text-slate-500" 
                        : "bg-teal-500 text-white"
                    }`}>
                      {post.isAnonymous ? <User className="w-4 h-4" /> : post.author?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">
                          {post.author}
                        </span>
                        {/* Status Badges */}
                        {post.isAnonymous && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-extrabold text-[9px] uppercase tracking-wider border border-slate-200/60">
                            ANONYMOUS STUDENT
                          </span>
                        )}
                        {post.isMentor && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider border border-blue-200/40">
                            <Award className="w-3 h-3 text-blue-600" />
                            MENTOR
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {post.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap select-text">
                  {post.content}
                </div>

                {/* Code Block if any */}
                {post.codeBlock && (
                  <div className="bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-lg overflow-x-auto shadow-inner border border-slate-800 leading-relaxed my-1">
                    <pre><code>{post.codeBlock}</code></pre>
                  </div>
                )}

                {/* Post Footer Row Actions */}
                <div className="flex items-center gap-4 border-t border-slate-50 pt-3 text-xs font-semibold text-slate-500">
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors ml-1">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
