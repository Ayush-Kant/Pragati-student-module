import React from "react";

export default function AssessmentStatus({ status = "available" }) {
  const statusConfig = {
    completed: "bg-green-100 text-green-700 border-green-300",
    available: "bg-blue-100 text-blue-700 border-blue-300",
    expired: "bg-red-100 text-red-700 border-red-300",
    in_progress: "bg-amber-100 text-amber-700 border-amber-300"
  };

  const currentStyle = statusConfig[status] || statusConfig.available;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${currentStyle}`}>
      {status.replace("_", " ")}
    </span>
  );
}