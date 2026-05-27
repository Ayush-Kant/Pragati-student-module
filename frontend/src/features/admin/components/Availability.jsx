import React from "react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SLOTS = ["09:00 AM", "02:00 PM", "07:00 PM"];

const Availability = ({ watch, setValue }) => {
  const availability = watch("availability") || {};

  const toggleSlot = (day, slot) => {
    const key = `${day}_${slot}`;
    const updated = { ...availability };
    if (updated[key]) {
      delete updated[key];
    } else {
      updated[key] = true;
    }
    setValue("availability", updated, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="w-full border border-slate-200 border-l-4 border-l-emerald-500 rounded-2xl p-6 bg-white shadow-sm">
      {/* Title & Icon Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Weekly Availability</h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Select the slots when you are available for 1:1 mentorship sessions.
            <br />
            These can be adjusted later.
          </p>
        </div>
        <div className="w-11 h-11 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-500 text-lg flex-shrink-0 bg-emerald-50 shadow-inner">
          📅
        </div>
      </div>

      {/* Grid container with horizontal scrolling on mobile */}
      <div className="overflow-x-auto my-6 -mx-6 px-6">
        <table className="w-full min-w-[650px] border-collapse border-spacing-2">
          <thead>
            <tr>
              <th className="w-24" />
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="text-xs font-bold text-slate-500 text-center pb-3 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot}>
                {/* Row Time label */}
                <td className="py-2.5 pr-4 text-left vertical-middle whitespace-nowrap">
                  <div className="text-xs font-bold text-slate-800">{slot}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">(45 mins)</div>
                </td>

                {/* Day columns */}
                {DAYS.map((day) => {
                  const key = `${day}_${slot}`;
                  const isSelected = !!availability[key];

                  return (
                    <td key={day} className="p-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSlot(day, slot)}
                        className={`w-full min-h-[50px] flex flex-col items-center justify-center rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50/70 border-emerald-400 text-emerald-600 font-bold px-2 py-1.5"
                            : "bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 py-3"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <span className="text-[10px] uppercase font-extrabold">{slot.split(" ")[0]}</span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-95">
                              Selected
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-light">+</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lavender Alert Box Info banner */}
      <div className="flex gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-6">
        <span className="text-indigo-600 text-lg leading-none mt-0.5 flex-shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Standard sessions are 45 minutes long. You can configure your timezone and buffer times in
          settings after registration.
        </p>
      </div>
    </div>
  );
};

export default Availability;
