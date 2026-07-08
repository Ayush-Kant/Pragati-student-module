import React from "react";
import DriveRow from "./DriveRow";

const DriveTable = ({ drives = [], onView, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-150 rounded-2xl shadow-sm">
      <table className="w-full min-w-[700px] border-collapse text-left">
        <thead>
          <tr className="bg-gray-50/75 border-b border-gray-150">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Company & Role
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Package
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Drive Date
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Deadline
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {drives.map((drive) => (
            <DriveRow
              key={drive.id}
              drive={drive}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriveTable;
