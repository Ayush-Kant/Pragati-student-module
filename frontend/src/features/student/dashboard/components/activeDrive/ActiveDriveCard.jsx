import React from "react";
import PropTypes from "prop-types";

const ActiveDriveCard = ({ data, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-full">
    <h3 className="text-base font-bold text-gray-800 mb-3">🎯 Active Drive</h3>
    {loading ? (
      <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
    ) : data ? (
      <div>
        <p className="text-sm font-semibold text-gray-800">{data.companyName} — {data.role}</p>
        <p className="text-xs text-gray-400 mt-1">Drive on {data.driveDate}</p>
        <span className="inline-block mt-2 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{data.eligibility}</span>
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">No active drives.</p>
    )}
  </div>
);

ActiveDriveCard.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};

export default ActiveDriveCard;