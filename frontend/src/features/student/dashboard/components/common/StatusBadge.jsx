import React from "react";
import PropTypes from "prop-types";

export default function StatusBadge({ status = "pending" }) {
  const styles = {
    active: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const currentStyle = styles[status.toLowerCase()] || styles.pending;

  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
}

StatusBadge.propTypes = { status: PropTypes.string };