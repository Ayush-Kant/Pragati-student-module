import React from "react";
import { Check, UserCheck, Layers, ClipboardCheck, BookOpen, UserRoundCheck, Landmark } from "lucide-react";

const steps = [
  { label: "Profile Registered", icon: UserCheck },
  { label: "Academics Verified", icon: ClipboardCheck },
  { label: "Resume Verified", icon: BookOpen },
  { label: "Eligibility Check", icon: UserRoundCheck },
  { label: "Drives & Interviews", icon: Layers },
  { label: "Placed", icon: Landmark }
];

export const PlacementProgress = ({ studentStatus = "Eligible", darkMode }) => {

  // Determine current active index based on placementStatus
  let activeIndex = 3; // default: eligibility check
  if (studentStatus === "Placed") {
    activeIndex = 5;
  } else if (studentStatus === "Eligible" || studentStatus === "In Progress") {
    activeIndex = 4;
  } else if (studentStatus === "Pending") {
    activeIndex = 3;
  } else if (studentStatus === "Not Eligible") {
    activeIndex = -1; // Blocked state
  }

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-6">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Placement Pipeline</h3>
        <p className="text-xs text-gray-400">Chronological stages of your placement lifecycle</p>
      </div>

      {studentStatus === "Not Eligible" ? (
        <div className={`p-4 rounded-xl border text-xs font-semibold ${darkMode ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
          Your pipeline is currently paused due to eligibility status: Not Eligible. Please clear backlogs or contact your placement administrator.
        </div>
      ) : (
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
          {/* Connector Line (Desktop) */}
          <div className={`absolute top-[17px] left-8 right-8 h-0.5 hidden md:block z-0 ${darkMode ? 'bg-[#3D3D3D]' : 'bg-gray-100'}`} />

          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            let circleClass = darkMode ? "border-[#3D3D3D] bg-[#2D2D2D] text-gray-500" : "border-gray-200 bg-white text-gray-400";
            let labelClass = "text-gray-400";

            if (isCompleted) {
              circleClass = darkMode ? "border-[#ff6d34] bg-[#ff6d34] text-white" : "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100";
              labelClass = darkMode ? "text-[#ff6d34] font-bold" : "text-indigo-600 font-bold";
            } else if (isActive) {
              circleClass = darkMode ? "border-[#00bea3] bg-[#2D2D2D] text-[#00bea3] animate-pulse border-2" : "border-indigo-600 bg-white text-indigo-600 animate-pulse border-2 shadow-sm shadow-indigo-50";
              labelClass = darkMode ? "text-white font-bold" : "text-gray-800 font-bold";
            }

            return (
              <div key={idx} className="relative flex md:flex-col items-center gap-4 md:gap-2.5 flex-1 z-10 text-center">
                {/* Visual Step Circle */}
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${circleClass}`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : <StepIcon className="w-4.5 h-4.5" />}
                </div>

                {/* Step Label */}
                <div>
                  <span className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                    Step {idx + 1}
                  </span>
                  <span className={`block text-xs font-semibold leading-normal ${labelClass}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlacementProgress;
