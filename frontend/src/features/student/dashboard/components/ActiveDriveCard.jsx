import React from "react";
import { Link } from "react-router-dom";

export default function ActiveDriveCard({ drive }) {
  if (!drive || !drive.driveId) {
    return (
      <div className="bg-white border rounded-xl p-6 shadow-sm text-center text-gray-500">
        No active placement drive currently assigned.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Active Drive
        </span>
        <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
          {drive.enrollmentStatus || "Enrolled"}
        </span>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900">{drive.driveName}</h3>
        <p className="text-sm text-gray-500">{drive.companyName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 pt-2 border-t">
        <div>
          <span className="text-gray-400 block">Start Date</span>
          <span className="font-semibold text-gray-800">{drive.startDate || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-400 block">End Date</span>
          <span className="font-semibold text-gray-800">{drive.endDate || "N/A"}</span>
        </div>
      </div>

      <Link
        to="/student/courses"
        className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-sm"
      >
        View Drive Details
      </Link>
    </div>
  );
}