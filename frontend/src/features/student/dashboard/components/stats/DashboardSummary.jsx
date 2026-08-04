import React from "react";
import PropTypes from "prop-types";

export default function DashboardSummary({ summary = "" }) {
  if (!summary) return null;
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 mb-5 text-xs text-gray-700 leading-relaxed">
      💡 <span className="font-semibold text-gray-900">Summary:</span> {summary}
    </div>
  );
}

DashboardSummary.propTypes = { summary: PropTypes.string };