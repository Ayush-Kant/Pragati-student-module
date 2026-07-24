import React from "react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/studentProfileHelpers";

export const AppliedCompanies = ({ placements = [], darkMode }) => {
  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Job Applications</h3>
        <p className="text-xs text-gray-400">Companies applied to and active status updates</p>
      </div>

      <div className="overflow-x-auto">
        {placements.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">No company applications found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100'}`}>
                <th className="pb-3">Company</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">CTC Package</th>
                <th className="pb-3">Applied Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${darkMode ? 'divide-[#3D3D3D] text-gray-400' : 'divide-gray-50/50 text-gray-600'}`}>
              {placements.map((item, index) => (
                <tr key={item.id || `${item.company}-${index}`} className={`transition-colors ${darkMode ? 'hover:bg-[#1A1A1A]' : 'hover:bg-slate-50/20'}`}>
                  <td className={`py-3 font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${darkMode ? 'bg-[#1A1A1A] border border-[#3D3D3D] text-[#ff6d34]' : 'bg-indigo-50 border border-indigo-100/50 text-indigo-600'}`}>
                      {item.company[0]}
                    </div>
                    {item.company}
                  </td>
                  <td className={`py-3 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.role}</td>
                  <td className={`py-3 font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{item.ctc}</td>
                  <td className="py-3 text-gray-400 font-medium">{formatDate(item.appliedDate)}</td>
                  <td className="py-3 text-right">
                    <StatusBadge status={item.status} type="placement" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AppliedCompanies;
