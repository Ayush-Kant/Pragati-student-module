import React from "react";
import PropTypes from "prop-types";
import ProgressRing from "./ProgressRing";
import AttendanceCard from "./AttendanceCard";
import XPProgressCard from "./XPProgressCard";

export default function ProgressOverview({ data, loading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
      {/* Takes the existing ProgressRing component block */}
      <div className="md:col-span-1">
        <ProgressRing data={data?.courseProgress} loading={loading} />
      </div>
      
      {/* Embeds the dedicated sub-metric cards layout */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <AttendanceCard percentage={data?.attendanceRate || 0} loading={loading} />
        <XPProgressCard xp={data?.totalXp || 0} loading={loading} />
      </div>
    </div>
  );
}

ProgressOverview.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};