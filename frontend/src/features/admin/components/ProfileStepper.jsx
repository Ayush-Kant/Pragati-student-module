import React from "react";

const STEPS = [
  { n: 1, label: "Basic Information" },
  { n: 2, label: "Professional Profile" },
  { n: 3, label: "Experience & Links" },
  { n: 4, label: "Availability" },
];

export const StepperA = ({ step }) => {
  return (
    <div className="flex items-center gap-4 py-2">
      {STEPS.map((s, i) => {
        const active = s.n === step;
        const done = s.n < step;

        return (
          <React.Fragment key={s.n}>
            <div className="flex items-center">
              {active ? (
                // Active capsule button with outer border outline
                <div className="p-0.5 rounded-full border border-blue-600/30 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-white text-xs font-bold shadow-md">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white font-extrabold">
                      01
                    </span>
                    <span>{s.label}</span>
                  </div>
                </div>
              ) : (
                // Inactive steps
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold px-2 py-1.5 opacity-90">
                  <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-500 font-extrabold">
                    {done ? "✓" : `0${s.n}`}
                  </span>
                  <span className="text-slate-600 font-medium">{s.label}</span>
                </div>
              )}
            </div>
            {i < 3 && <div className="w-8 h-[1px] bg-slate-200" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const StepperB = ({ step }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto px-4 py-6">
      {STEPS.map((s, i) => {
        const done = s.n < step;
        const active = s.n === step;

        return (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center relative flex-1">
              <div className="flex items-center w-full justify-center">
                {/* Left Line */}
                <div
                  className={`flex-1 h-[2px] transition-colors duration-300 ${
                    i === 0 ? "bg-transparent" : done ? "bg-emerald-500" : active ? "bg-violet-600" : "bg-slate-200"
                  }`}
                />

                {/* Circle step indicator */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    done
                      ? "bg-emerald-100 border-2 border-emerald-500 text-emerald-600"
                      : active
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {done ? (
                    <span className="text-emerald-600 text-base">✓</span>
                  ) : (
                    <span>{s.n}</span>
                  )}
                </div>

                {/* Right Line */}
                <div
                  className={`flex-1 h-[2px] transition-colors duration-300 ${
                    i === STEPS.length - 1 ? "bg-transparent" : s.n < step ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-semibold mt-2 text-center absolute -bottom-5 w-32 ${
                  done ? "text-emerald-600" : active ? "text-violet-700" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const ProgressBars = ({ step }) => {
  return (
    <div className="w-full">
      {/* 4 horizontal progress segments */}
      <div className="flex gap-1.5 w-full mb-2">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              s.n <= step ? "bg-violet-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      {/* Labels below */}
      <div className="flex justify-between w-full px-1">
        {STEPS.map((s) => {
          const activeOrDone = s.n <= step;
          return (
            <span
              key={s.n}
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                activeOrDone ? "text-violet-600" : "text-slate-300"
              }`}
            >
              {s.label.split(" ")[0]} INFO
            </span>
          );
        })}
      </div>
    </div>
  );
};

const ProfileStepper = ({ step }) => {
  if (step === 1) return <StepperA step={step} />;
  if (step === 2 || step === 3) return <StepperB step={step} />;
  return <ProgressBars step={step} />;
};

export default ProfileStepper;
