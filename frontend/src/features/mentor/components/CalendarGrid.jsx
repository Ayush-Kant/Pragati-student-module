import React from "react";
import { Plus, User, Clock, Check } from "lucide-react";

const DAYS_OF_WEEK = [
  { key: "Mon", label: "MON", date: "23" },
  { key: "Tue", label: "TUE", date: "24" },
  { key: "Wed", label: "WED", date: "25" },
  { key: "Thu", label: "THU", date: "26" },
  { key: "Fri", label: "FRI", date: "27" }
];

export default function CalendarGrid({ slots, onSlotClick, onAddSlotClick }) {
  // Group slots by day
  const slotsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day.key] = slots.filter((s) => s.day === day.key);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-x-auto select-none">
      <div className="min-w-[800px] grid grid-cols-5 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = slotsByDay[day.key] || [];
          return (
            <div key={day.key} className="flex flex-col min-h-[450px]">
              {/* Day Header */}
              <div className="text-center pb-4 mb-4 border-b border-slate-100 flex flex-col items-center">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {day.label}
                </span>
                <span className="text-xl font-extrabold text-slate-800 mt-0.5">
                  {day.date}
                </span>
              </div>

              {/* Day Slot list */}
              <div className="flex-1 flex flex-col gap-3">
                {daySlots.map((slot) => {
                  const isBooked = slot.status === "Booked";
                  return (
                    <div
                      key={slot.id}
                      onClick={() => isBooked && onSlotClick(slot.id)}
                      className={`group p-3.5 rounded-xl border text-left transition-all duration-300 ${
                        isBooked
                          ? "bg-slate-50 border-slate-200 cursor-pointer hover:bg-slate-100 hover:shadow-sm"
                          : "bg-blue-50/40 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[13px] font-extrabold ${
                          isBooked ? "text-slate-700" : "text-blue-700"
                        }`}>
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded">
                          {slot.duration}
                        </span>
                      </div>
                      
                      {isBooked ? (
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                            {slot.student?.[0] || <User className="w-2.5 h-2.5" />}
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 truncate flex-1">
                            {slot.student}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gray-200 text-gray-700">
                            Booked
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">
                            Available
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add slot placeholder button */}
                <button
                  onClick={() => onAddSlotClick(day.key)}
                  className="flex-1 min-h-[80px] rounded-xl border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 flex items-center justify-center text-slate-300 hover:text-blue-600 transition-all cursor-pointer group"
                  title={`Add slot to ${day.label}`}
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
