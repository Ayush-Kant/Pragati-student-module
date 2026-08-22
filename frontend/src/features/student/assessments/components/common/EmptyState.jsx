import React from "react";

export default function EmptyState({ title = "No Data Found", description = "There are no records to display at this time." }) {
  return (
    <div className="text-center p-8 bg-gray-50 border border-dashed rounded-xl">
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}