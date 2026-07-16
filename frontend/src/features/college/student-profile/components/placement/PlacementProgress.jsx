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

export const PlacementProgress = ({ studentStatus = "Eligible" }) => {

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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800">Placement Pipeline</h3>
        <p className="text-xs text-gray-400">Chronological stages of your placement lifecycle</p>
      </div>

      {studentStatus === "Not Eligible" ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
          Your pipeline is currently paused due to eligibility status: Not Eligible. Please clear backlogs or contact your placement administrator.
        </div>
      ) : (
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-[17px] left-8 right-8 h-0.5 bg-gray-100 hidden md:block z-0" />

          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            let circleClass = "border-gray-200 bg-white text-gray-400";
            let labelClass = "text-gray-400";

            if (isCompleted) {
              circleClass = "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100";
              labelClass = "text-indigo-600 font-bold";
            } else if (isActive) {
              circleClass = "border-indigo-600 bg-white text-indigo-600 animate-pulse border-2 shadow-sm shadow-indigo-50";
              labelClass = "text-gray-800 font-bold";
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
