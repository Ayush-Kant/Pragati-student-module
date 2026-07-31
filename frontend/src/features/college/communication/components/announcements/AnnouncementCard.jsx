import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Send,
  Globe,
  Tag,
  User,
  AlertTriangle,
  X,
} from "lucide-react";

import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

const priorityStyles = {
  High: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900",
  Medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  Low: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const AnnouncementCard = ({
  announcements = [],
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}) => {
  const outletContext = useOutletContext() || {};
  const darkMode = outletContext.darkMode || false;

  // Local state to manage delete modal confirmation
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      await onDelete?.(itemToDelete);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (announcements.length === 0) {
    return (
      <EmptyState
        title="No Announcements"
        description="There are no announcements in this category."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
              darkMode
                ? "border-slate-800 bg-[#151D30] hover:border-slate-700"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
            }`}
          >
            <div>
              {/* Header badges */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                  <Tag size={12} />
                  {item.categoryName || item.category || "General"}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                      priorityStyles[item.priority] || priorityStyles.Medium
                    }`}
                  >
                    {item.priority || "Medium"}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-blue-500 transition-colors">
                {item.title}
              </h3>

              {/* Content snippet */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {item.description || item.content}
              </p>

              {/* Metadata pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Globe size={13} />
                  {item.targetAudience ||
                    (Array.isArray(item.audience)
                      ? item.audience.join(", ")
                      : item.audience) ||
                    "All Students"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {item.publishedDate
                    ? new Date(item.publishedDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )
                    : item.publishDate || "Draft"}
                </span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <User size={12} /> {item.creatorName || "College Admin"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView?.(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                  title="View"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => onEdit?.(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                {item.status === "Published" ? (
                  <button
                    onClick={() => onUnpublish?.(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    title="Unpublish"
                  >
                    <Send size={16} className="rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={() => onPublish?.(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                    title="Publish"
                  >
                    <Send size={16} />
                  </button>
                )}

                {/* Triggers Modal opening instead of instant delete */}
                <button
                  onClick={() => setItemToDelete(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#151D30] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                <AlertTriangle size={24} />
              </div>
              <button
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Delete Announcement?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  "{itemToDelete?.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnnouncementCard;