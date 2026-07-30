import React from "react";
import StatusBadge from "../common/StatusBadge";

const AnnouncementRow = ({
  announcement,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}) => {
  const {
    title,
    category,
    audience,
    publishDate,
    status,
  } = announcement;

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <td className="px-4 py-3 font-medium">
        {title}
      </td>

      <td className="px-4 py-3">
        {category}
      </td>

      <td className="px-4 py-3">
        {Array.isArray(audience)
          ? audience.join(", ")
          : audience}
      </td>

      <td className="px-4 py-3">
        {publishDate || "-"}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={status} />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(announcement)}
            className="text-blue-600 hover:underline"
          >
            View
          </button>

          <button
            onClick={() => onEdit?.(announcement)}
            className="text-green-600 hover:underline"
          >
            Edit
          </button>

          {status === "Published" ? (
            <button
              onClick={() => onUnpublish?.(announcement)}
              className="text-yellow-600 hover:underline"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={() => onPublish?.(announcement)}
              className="text-indigo-600 hover:underline"
            >
              Publish
            </button>
          )}

          <button
            onClick={() => onDelete?.(announcement)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AnnouncementRow;