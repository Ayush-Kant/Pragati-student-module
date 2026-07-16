import { Check, Clock3, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const statusFlow = [
  {
    key: "nominated",
    label: "Nominated",
  },
  {
    key: "waiting",
    label: "Waiting",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
  },
  {
    key: "rejected",
    label: "Rejected",
  },
];

const NominationStatus = ({ status, timeline = {} }) => {
  const { darkMode } = useOutletContext();

  const getStatusState = (stepLabel) => {
    if (status === "Rejected") {
      if (stepLabel === "Rejected") return "current";

      if (stepLabel === "Nominated" || stepLabel === "Waiting") {
        return "completed";
      }

      return "upcoming";
    }

    const labels = statusFlow.map((item) => item.label);

    const currentIndex = labels.indexOf(status);
    const stepIndex = labels.indexOf(stepLabel);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";

    return "upcoming";
  };

  const getIndicator = (stepLabel) => {
    const state = getStatusState(stepLabel);

    switch (state) {
      case "completed":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <Check size={18} strokeWidth={2.5} />
          </div>
        );

      case "current":
        return (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md ${
              stepLabel === "Rejected" ? "bg-red-500" : "bg-amber-500"
            }`}
          >
            {stepLabel === "Rejected" ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <Clock3 size={18} strokeWidth={2.5} />
            )}
          </div>
        );

      default:
        return (
          <div
            className={`h-10 w-10 rounded-full border-2 ${
              darkMode
                ? "border-slate-600 bg-slate-800"
                : "border-slate-300 bg-white"
            }`}
          />
        );
    }
  };

  return (
    <div
      className={`rounded-3xl border p-6 ${
        darkMode ? "border-slate-700 bg-[#151D30]" : "border-slate-200 bg-white"
      }`}
    >
      {/* Current Status */}

      <div
        className={`mb-8 rounded-2xl border px-5 py-4 ${
          status === "Shortlisted"
            ? "border-emerald-500/20 bg-emerald-500/10"
            : status === "Rejected"
              ? "border-red-500/20 bg-red-500/10"
              : "border-amber-500/20 bg-amber-500/10"
        }`}
      >
        <p
          className={`text-xs font-medium uppercase tracking-widest ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Current Status
        </p>

        <h3
          className={`mt-2 text-xl font-bold ${
            status === "Shortlisted"
              ? "text-emerald-500"
              : status === "Rejected"
                ? "text-red-500"
                : "text-amber-500"
          }`}
        >
          {status}
        </h3>
      </div>

      {/* Header */}

      <div>
        <h3 className="text-lg font-semibold">Nomination Timeline</h3>

        <p
          className={`mt-1 text-sm ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Track the complete nomination journey.
        </p>
      </div>

      {/* Timeline */}

      <div className="mt-8 space-y-7">
        {statusFlow.map((step, index) => {
          const state = getStatusState(step.label);

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              {/* Indicator */}

              <div className="relative z-10">{getIndicator(step.label)}</div>

              {/* Connector */}

              {index !== statusFlow.length - 1 && (
                <div
                  className={`absolute left-[19px] top-10 h-12 w-0.5 ${
                    state === "completed" ||
                    (state === "current" && step.label !== "Rejected")
                      ? "bg-emerald-500"
                      : darkMode
                        ? "bg-slate-700"
                        : "bg-slate-300"
                  }`}
                />
              )}

              {/* Content */}

              <div className="pt-1">
                <h4
                  className={`font-semibold ${
                    state === "completed"
                      ? "text-emerald-500"
                      : state === "current"
                        ? step.label === "Rejected"
                          ? "text-red-500"
                          : "text-amber-500"
                        : darkMode
                          ? "text-slate-300"
                          : "text-slate-600"
                  }`}
                >
                  {step.label}
                </h4>

                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {timeline?.[step.key] || "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NominationStatus;
