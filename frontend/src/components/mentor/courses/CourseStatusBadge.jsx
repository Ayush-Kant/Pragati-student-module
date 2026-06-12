import React from 'react';

const STATUS_STYLES = {
<<<<<<< HEAD
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-orange-100 text-orange-700",
  archived: "bg-gray-100 text-gray-700",
=======
  Published: "bg-emerald-100 text-emerald-700",
  Draft: "bg-orange-100 text-orange-700",
  Archived: "bg-gray-100 text-gray-700",
>>>>>>> d403c07 (updated local branch)
};

export default function CourseStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${style}`}>
      <span className="text-xs">●</span>
      {status}
    </span>
  );
}