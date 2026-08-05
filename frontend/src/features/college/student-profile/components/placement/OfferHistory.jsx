import React, { useMemo } from "react";
import { Check, Download, X } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const OfferHistory = ({ placements = [], onAcceptOffer, onRejectOffer, darkMode }) => {
  // Extract companies that have "Placed" or "Offered" status
  const offersList = useMemo(() => {
    return placements.filter(
      (comp) => comp.status === "Placed" || comp.status === "Offered"
    );
  }, [placements]);

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Job Offers Secured</h3>
        <p className="text-xs text-gray-400">Offer designations, compensation packages, and action statuses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offersList.length === 0 ? (
          <div className="col-span-2 text-center py-6 text-sm text-gray-400">
            No active job offers secured yet.
          </div>
        ) : (
          offersList.map((offer, index) => (
            <div
              key={offer.id || `${offer.company}-${index}`}
              className={`p-5 rounded-xl border flex flex-col justify-between gap-4 ${
                darkMode
                  ? 'bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] border-[#3D3D3D]'
                  : 'bg-gradient-to-br from-indigo-50/20 to-white border-indigo-100/60'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-500'}`}>
                    Offer Letter Issued
                  </span>
                  <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{offer.company}</h4>
                  <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{offer.role}</p>
                </div>
                <StatusBadge status={offer.status === "Placed" ? "Accepted" : "Pending"} type="offer" />
              </div>

              <div className={`flex justify-between items-center py-2.5 border-t border-b ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-100/60'}`}>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Compensation
                  </span>
                  <span className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{offer.ctc}</span>
                </div>
                <button className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  darkMode
                    ? 'bg-[#1A1A1A] border border-[#3D3D3D] text-gray-400 hover:bg-[#3D3D3D] hover:text-white'
                    : 'text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30'
                }`}>
                  <Download className="w-3.5 h-3.5" />
                  PDF Letter
                </button>
              </div>

              {offer.status === "Offered" && (
                <div className="flex gap-2.5">
                  <button
                    onClick={() => onRejectOffer?.(offer.id, offer.company)}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer ${darkMode ? 'border border-rose-500/30 text-rose-400 hover:bg-rose-500/10' : 'border border-rose-200 text-rose-600 hover:bg-rose-50'}`}
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => onAcceptOffer?.(offer.id, offer.company)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#00bea3] hover:bg-[#00bea3]/90 text-white text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfferHistory;
