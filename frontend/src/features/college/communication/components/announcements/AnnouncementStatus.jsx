import React from "react";
import StatusBadge from "../common/StatusBadge";

const AnnouncementStatus = ({ status, onPublish, onUnpublish, isActionLoading = false }) => {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      {status === "Draft" && onPublish && (
        <button
          onClick={onPublish}
          disabled={isActionLoading}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
        >
          Publish
        </button>
      )}
      {status === "Published" && onUnpublish && (
        <button
          onClick={onUnpublish}
          disabled={isActionLoading}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition-colors disabled:opacity-50"
        >
          Unpublish
        </button>
      )}
    </div>
  );
};

export default AnnouncementStatus;
