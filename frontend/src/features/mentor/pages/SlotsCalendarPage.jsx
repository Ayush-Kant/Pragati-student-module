import React, { useState } from "react";
import useSlots from "../hooks/useSlots";
import CalendarGrid from "../components/CalendarGrid";
import BookingDetailsDrawer from "../components/BookingDetailsDrawer";
import { 
  Calendar as CalendarIcon, 
  Table as TableIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Check, 
  Info,
  X 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SlotsCalendarPage() {
  const {
    slots,
    loading,
    error,
    viewMode,
    setViewMode,
    selectedSlotId,
    bookingDetails,
    bookingDetailsLoading,
    weekRange,
    fetchBookingDetails,
    cancelBooking,
    addSlot,
    closeDrawer
  } = useSlots();

  // Slot creation state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSlotDay, setNewSlotDay] = useState("Mon");
  const [newSlotTime, setNewSlotTime] = useState("10:00 AM");
  const [newSlotDuration, setNewSlotDuration] = useState("30 min");

  const handleSlotClick = (slotId) => {
    fetchBookingDetails(slotId);
  };

  const handleCancel = async (slotId, bookingId) => {
    const res = await cancelBooking(slotId, bookingId);
    if (res.success) {
      toast.success("Booking cancelled successfully! Slot is now available.");
    } else {
      toast.error(res.error || "Failed to cancel booking");
    }
  };

  const handleAddSlotTrigger = (day) => {
    setNewSlotDay(day || "Mon");
    setIsAddModalOpen(true);
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    const res = await addSlot({
      time: newSlotTime,
      duration: newSlotDuration,
      day: newSlotDay
    });

    if (res.success) {
      toast.success("Slot added successfully!");
      setIsAddModalOpen(false);
    } else {
      toast.error(res.error || "Failed to add slot");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none pb-12">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner">
            <CalendarIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Doubt-Clearing Slots
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">
              Manage your weekly availability slots for student doubt-clearing sessions.
            </p>
          </div>
        </div>

        {/* View Controls & Add Slots */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Toggle Group */}
          <div className="flex border border-slate-200 rounded-xl bg-slate-50 p-1 shadow-inner select-none">
            <button
              onClick={() => setViewMode("Calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === "Calendar"
                  ? "bg-white text-blue-600 shadow-sm border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode("Table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                viewMode === "Table"
                  ? "bg-white text-blue-600 shadow-sm border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => handleAddSlotTrigger("Mon")}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Slots</span>
          </button>
        </div>
      </div>

      {/* Sub-Header Calendar Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        {/* Date Selector Range */}
        <div className="flex items-center gap-2 select-none">
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer bg-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-extrabold text-slate-700 px-2 min-w-[140px] text-center">
            {weekRange.label}
          </span>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer bg-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl bg-white transition-colors cursor-pointer">
          Today
        </button>
      </div>

      {/* Calendar Grid / Table representation */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center text-slate-400 shadow-sm">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading slots schedule...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm">
          <span>{error}</span>
        </div>
      ) : viewMode === "Calendar" ? (
        <CalendarGrid
          slots={slots}
          onSlotClick={handleSlotClick}
          onAddSlotClick={handleAddSlotTrigger}
        />
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden select-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Day</th>
                  <th className="py-4 px-6">Time</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <Info className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
                        <p className="font-medium">No slots defined for this week</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => {
                    const isBooked = slot.status === "Booked";
                    return (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800">{slot.day}</td>
                        <td className="py-4 px-6 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{slot.time}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-medium">{slot.duration}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            isBooked 
                              ? "bg-slate-100 text-slate-600" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {slot.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {isBooked ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-50 flex items-center justify-center text-[10px] font-bold">
                                {slot.student?.[0] || "?"}
                              </div>
                              <span className="text-slate-800 font-bold">{slot.student}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {isBooked ? (
                            <button
                              onClick={() => handleSlotClick(slot.id)}
                              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors font-extrabold cursor-pointer"
                            >
                              View Details
                            </button>
                          ) : (
                            <span className="text-slate-300 font-semibold text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Details Drawer Overlay */}
      <BookingDetailsDrawer
        isOpen={selectedSlotId !== null}
        onClose={closeDrawer}
        booking={bookingDetails}
        loading={bookingDetailsLoading}
        onCancelBooking={handleCancel}
      />

      {/* Add Slot Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <div 
            onClick={() => setIsAddModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in" 
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-200 transition-all duration-300 animate-scale-in p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Create Doubt Slot
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Day</label>
                <select
                  value={newSlotDay}
                  onChange={(e) => setNewSlotDay(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white font-semibold cursor-pointer"
                >
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</label>
                <select
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white font-semibold cursor-pointer"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                <select
                  value={newSlotDuration}
                  onChange={(e) => setNewSlotDuration(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white font-semibold cursor-pointer"
                >
                  <option value="30 min">30 minutes</option>
                  <option value="60 min">60 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-extrabold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
