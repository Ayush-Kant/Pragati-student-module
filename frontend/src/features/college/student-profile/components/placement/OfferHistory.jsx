import React, { useMemo } from "react";
import { Check, Download, X } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const OfferHistory = ({ placements = [], onAcceptOffer, onRejectOffer }) => {
  // Extract companies that have "Placed" or "Offered" status
  const offersList = useMemo(() => {
    return placements.filter(
      (comp) => comp.status === "Placed" || comp.status === "Offered"
    );
  }, [placements]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-800">Job Offers Secured</h3>
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
              className="p-5 rounded-xl border border-indigo-100/60 bg-gradient-to-br from-indigo-50/20 to-white flex flex-col justify-between gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">
                    Offer Letter Issued
                  </span>
                  <h4 className="text-base font-bold text-gray-800">{offer.company}</h4>
                  <p className="text-xs font-semibold text-gray-500">{offer.role}</p>
                </div>
                <StatusBadge status={offer.status === "Placed" ? "Accepted" : "Pending"} type="offer" />
              </div>

              <div className="flex justify-between items-center py-2.5 border-t border-b border-gray-100/60">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Compensation
                  </span>
                  <span className="text-sm font-extrabold text-gray-800">{offer.ctc}</span>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  PDF Letter
                </button>
              </div>

              {offer.status === "Offered" && (
                <div className="flex gap-2.5">
                  <button
                    onClick={() => onRejectOffer?.(offer.id, offer.company)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => onAcceptOffer?.(offer.id, offer.company)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-100"
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
