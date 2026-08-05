import React from "react";
import { useOutletContext } from "react-router-dom";
import { X, Calendar, User, Tag, Shield, Clock, Paperclip, Megaphone } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const AnnouncementDetails = ({ announcement, isOpen, onClose }) => {
  const outletContext = useOutletContext() || {};
  const darkMode = outletContext.darkMode || false;

  if (!announcement || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        className={`w-full max-w-md h-full flex flex-col shadow-2xl transition-transform ${
          darkMode ? "bg-[#151D30] text-slate-100" : "bg-white text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-500 flex items-center gap-1">
              <Megaphone size={14} /> Announcement Details
            </span>
            <h2 className="text-lg font-bold truncate mt-1">{announcement.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <StatusBadge status={announcement.status} />
            <span className="text-xs px-2.5 py-1 font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Priority: {announcement.priority || "Medium"}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Content</h4>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-sm leading-relaxed whitespace-pre-wrap">
              {announcement.description || announcement.content}
            </div>
          </div>

          {/* Metadata Table */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Details</h4>
            <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5"><Tag size={15}/> Category</span>
                <span className="font-medium">{announcement.categoryName || announcement.category || "General"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5"><Shield size={15}/> Target Audience</span>
                <span className="font-medium text-right">{announcement.targetAudience || (Array.isArray(announcement.audience) ? announcement.audience.join(", ") : announcement.audience) || "All Students"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5"><User size={15}/> Created By</span>
                <span className="font-medium">{announcement.creatorName || "College Admin"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5"><Calendar size={15}/> Published Date</span>
                <span className="font-medium">{announcement.publishedDate ? new Date(announcement.publishedDate).toLocaleString() : announcement.publishDate || "Not Published"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5"><Clock size={15}/> Expiry Date</span>
                <span className="font-medium">{announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleDateString() : "No Expiry"}</span>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {announcement.attachmentUrl && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Attachment</h4>
              <a
                href={announcement.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                <Paperclip size={16} /> Attached Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;