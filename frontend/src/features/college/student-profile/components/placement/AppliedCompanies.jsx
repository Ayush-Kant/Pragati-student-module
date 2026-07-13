import React from "react";
import { Building2, Calendar, DollarSign, ExternalLink } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/studentProfileHelpers";

export const AppliedCompanies = ({ placements = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Job Applications</h3>
        <p className="text-xs text-gray-400">Companies applied to and active status updates</p>
      </div>

      <div className="overflow-x-auto">
        {placements.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">No company applications found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3">Company</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">CTC Package</th>
                <th className="pb-3">Applied Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 text-xs text-gray-600">
              {placements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="py-3 font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold">
                      {item.company[0]}
                    </div>
                    {item.company}
                  </td>
                  <td className="py-3 text-gray-600 font-medium">{item.role}</td>
                  <td className="py-3 text-gray-700 font-bold">{item.ctc}</td>
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
