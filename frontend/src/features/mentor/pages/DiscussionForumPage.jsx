import React from "react";
import useForum from "../hooks/useForum";
import ForumSidebar from "../components/ForumSidebar";
import ForumThreadView from "../components/ForumThreadView";
import RichTextReplyEditor from "../components/RichTextReplyEditor";
import { MessageSquare, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const FORUM_CATEGORIES = ["All", "Assignments", "Projects", "Quizzes", "General"];

export default function DiscussionForumPage() {
  const {
    threads,
    activeThread,
    activeThreadId,
    setActiveThreadId,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    postReply,
    handleVote,
    refresh
  } = useForum();

  const handlePostReply = async (content, isAnonymous) => {
    const result = await postReply(content, isAnonymous);
    if (result.success) {
      toast.success("Reply posted successfully!");
    } else {
      toast.error(result.error || "Failed to post reply");
    }
  };

  const handleVoteAction = (threadId, postId, direction) => {
    handleVote(threadId, postId, direction);
    toast.success(`Post ${direction === "up" ? "upvoted" : "downvoted"}`);
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto select-none">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-inner">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">
              Discussion Forum
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Discuss course topics, assignments, questions and answer announcements with mentees.
            </p>
          </div>
        </div>
        
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs bg-white shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Split View Content Frame */}
      {error ? (
        <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button onClick={refresh} className="underline text-xs hover:text-red-950 font-bold">Retry loading</button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Left Sidebar */}
          <ForumSidebar
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={setActiveThreadId}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={FORUM_CATEGORIES}
          />

          {/* Right Main Thread Detail View & Reply Editor Panel */}
          <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-170px)] overflow-hidden">
            {loading ? (
              <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium">Loading discussion thread...</p>
              </div>
            ) : (
              <>
                {/* Active Thread Details Card */}
                <ForumThreadView
                  thread={activeThread}
                  onVote={handleVoteAction}
                />
                
                {/* Fixed bottom Rich Text Reply Input Box */}
                {activeThread && (
                  <RichTextReplyEditor
                    onPostReply={handlePostReply}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
