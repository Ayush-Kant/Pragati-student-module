import React from "react";
import DriveRow from "./DriveRow";

const DriveTable = ({ drives = [], onView, onEdit, onDelete, darkMode }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl shadow-sm ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-150'}`}>
      <table className="w-full min-w-[700px] border-collapse text-left">
        <thead>
          <tr className={`border-b ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-gray-50/75 border-gray-150'}`}>
            <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Company & Role
            </th>
            <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Package
            </th>
            <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Drive Date
            </th>
            <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Deadline
            </th>
            <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Status
            </th>
            <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${darkMode ? 'divide-[#3D3D3D] bg-[#2D2D2D]' : 'divide-gray-100 bg-white'}`}>
          {drives.map((drive) => (
            <DriveRow
              key={drive.id}
              drive={drive}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              darkMode={darkMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriveTable;
