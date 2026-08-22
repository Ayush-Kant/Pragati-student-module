import React from "react";
import AnnouncementRow from "./AnnouncementRow";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

const AnnouncementTable = ({
  announcements = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!announcements.length) {
    return (
      <EmptyState
        title="No Announcements Found"
        description="There are no announcements to display."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Title
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Category
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Audience
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Publish Date
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {announcements.map((announcement) => (
            <AnnouncementRow
              key={announcement.id}
              announcement={announcement}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementTable;