import React from "react";
import { MessageSquare, Search } from "lucide-react";

export default function ForumSidebar({
  threads,
  activeThreadId,
  onSelectThread,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  categories
}) {
  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case "assignments":
      case "assignment":
        return "bg-blue-100 text-blue-700 font-bold";
      case "projects":
      case "project":
        return "bg-amber-100 text-amber-800 font-bold";
      case "quizzes":
      case "quiz":
        return "bg-purple-100 text-purple-700 font-bold";
      case "general":
      default:
        return "bg-slate-100 text-slate-700 font-bold";
    }
  };

  return (
    <div className="w-full md:w-[360px] flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-170px)]">
      {/* Category Pills & Search Box */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-50/50 focus:bg-white rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Categories Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Categories
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Threads List Header */}
      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Threads
        </h4>
        <span className="text-[11px] font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
          {threads.length} {threads.length === 1 ? "thread" : "threads"}
        </span>
      </div>

      {/* Active Threads Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium">No threads found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching for another topic.</p>
          </div>
        ) : (
          threads.map((thread) => {
            const isActive = thread.id === activeThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`p-4 cursor-pointer transition-all flex flex-col gap-2 ${
                  isActive
                    ? "bg-blue-50/40 border-l-4 border-l-blue-600 shadow-sm"
                    : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${getCategoryBadgeClass(thread.category)}`}>
                    {thread.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                    {thread.timeAgo}
                  </span>
                </div>
                <h5 className={`text-[13px] md:text-sm font-semibold leading-snug break-words ${
                  isActive ? "text-blue-700" : "text-slate-800"
                }`}>
                  {thread.title}
                </h5>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{thread.repliesCount} replies</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
