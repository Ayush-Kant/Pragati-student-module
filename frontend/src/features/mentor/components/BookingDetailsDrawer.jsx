import React, { useState } from "react";
import { X, Copy, Check, Calendar, Mail, FileText, ExternalLink } from "lucide-react";

export default function BookingDetailsDrawer({
  isOpen,
  onClose,
  booking,
  loading,
  onCancelBooking
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!booking?.link) return;
    navigator.clipboard.writeText(booking.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in" 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10 transition-transform duration-300 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
            Booking Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Loading details...</p>
            </div>
          ) : booking ? (
            <>
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-sm select-none">
                  {booking.studentName ? booking.studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "JD"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-extrabold text-slate-800 truncate leading-tight">
                    {booking.studentName}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.email}</span>
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  STATUS
                </h5>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === "Confirmed" 
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200/50" 
                      : "bg-amber-100 text-amber-800 border border-amber-200/50"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  SCHEDULE
                </h5>
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-slate-700">
                    <p className="text-sm font-extrabold text-slate-800 leading-snug">
                      {booking.schedule}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      Booked At: {booking.time} ({booking.duration})
                    </p>
                  </div>
                </div>
              </div>

              {/* Meeting Link Section */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  MEETING LINK
                </h5>
                <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <a
                      href={`https://${booking.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline truncate flex items-center gap-1"
                    >
                      <span className="truncate">{booking.link}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Topic Notes Section */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  TOPIC / NOTES
                </h5>
                <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap flex-1">
                    {booking.notes || "No notes provided for this session."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-sm font-medium">No booking details available.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {booking && (
          <div className="p-6 border-t border-slate-100 space-y-3 flex-shrink-0 bg-slate-50/30">
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-extrabold text-sm shadow-sm transition-all ${
                copied 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Meeting Link</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this booking?")) {
                  onCancelBooking(booking.slotId, booking.bookingId);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-sm border border-red-200 transition-colors cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
