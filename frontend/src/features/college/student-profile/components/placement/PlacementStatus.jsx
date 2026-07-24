import React, { useMemo } from "react";
import { Briefcase, CheckCircle, ShieldAlert, Award } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const PlacementStatus = ({ student = {}, placements = [], darkMode }) => {
  const isEligible = student.placementStatus !== "Not Eligible";
  
  // Performance Optimization: Memoize active offers
  const activeOffers = useMemo(() => {
    return placements.filter((p) => p.status === "Placed" || p.status === "Offered");
  }, [placements]);

  // Performance Optimization: Memoize highest offer calculation
  const highestOffer = useMemo(() => {
    return activeOffers.length > 0
      ? activeOffers.reduce((max, curr) => {
          const ctcVal = parseFloat(curr.ctc.replace(/[^0-9.]/g, ""));
          return ctcVal > max ? ctcVal : max;
        }, 0)
      : 0;
  }, [activeOffers]);

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className={`flex items-center justify-between pb-4 border-b mb-4 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-50'}`}>
        <div className="flex items-center gap-2">
          <Briefcase className={`w-5 h-5 ${darkMode ? 'text-[#00bea3]' : 'text-indigo-500'}`} />
          <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Placement Overview</h3>
        </div>
        <StatusBadge status={student.placementStatus} type="placement" />
      </div>

      <div className="space-y-4">
        {/* Status indicator row */}
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
            isEligible
              ? darkMode ? "bg-[#1A1A1A] border-[#00bea3]/30 text-[#00bea3]" : "bg-emerald-50 border-emerald-100 text-emerald-600"
              : "bg-rose-50 border-rose-100 text-rose-600"
          }`}>
            {isEligible ? <CheckCircle className="w-5.5 h-5.5" /> : <ShieldAlert className="w-5.5 h-5.5" />}
          </div>
          <div>
            <span className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {isEligible ? "Drive Eligibility Cleared" : "Eligibility Restricted"}
            </span>
            <p className="text-xs text-gray-400 leading-normal mt-0.5">
              {isEligible
                ? "Eligible for active placement operations. Academic criteria and attendance verified."
                : "Restricted from drives. Contact administration regarding attendance or backlog issues."}
            </p>
          </div>
        </div>

        {/* Offer highlights */}
        {activeOffers.length > 0 && (
          <div className={`flex items-start gap-3.5 p-4 rounded-xl border ${darkMode ? 'bg-[#1A1A1A] border-[#00bea3]/30' : 'bg-blue-50/20 border-blue-100/50'}`}>
            <div className={`p-2 rounded-lg flex-shrink-0 ${darkMode ? 'bg-[#2D2D2D] border border-[#00bea3]/30 text-[#00bea3]' : 'bg-blue-50 border border-blue-100 text-blue-600'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className={`block text-xs font-bold ${darkMode ? 'text-[#00bea3]' : 'text-blue-700'}`}>Active Selection Secured</span>
              <p className={`text-[11px] leading-normal mt-0.5 ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>
                Successfully placed! Highest package offered is <span className="font-extrabold">{highestOffer} LPA</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementStatus;
