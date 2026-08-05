import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronDown, CalendarDays, Building2, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { getPlacementDrives } from "../../../placement-drives/services/placementDriveService";

// Status badge colours matching the placement-drives module
const STATUS_STYLES = {
  Open:      { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-500/15 text-emerald-400" },
  Upcoming:  { light: "bg-blue-100 text-blue-700",       dark: "bg-blue-500/15 text-blue-400" },
  Closed:    { light: "bg-slate-100 text-slate-600",     dark: "bg-slate-500/15 text-slate-400" },
  Completed: { light: "bg-violet-100 text-violet-700",   dark: "bg-violet-500/15 text-violet-400" },
};

const statusStyle = (status, darkMode) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Upcoming;
  return darkMode ? s.dark : s.light;
};

const DriveSelector = ({ selectedDriveId, onDriveChange }) => {
  const { darkMode } = useOutletContext();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPlacementDrives();
        if (res.success) {
          // Show only active/upcoming drives for nomination
          const activeDrives = (res.data || []).filter(
            (d) => d.status === "Open" || d.status === "Upcoming"
          );
          setDrives(activeDrives);
        } else {
          setError("Failed to load placement drives.");
        }
      } catch {
        setError("Failed to load placement drives.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedDrive = drives.find((d) => d.id === selectedDriveId) || null;

  const base = `w-full rounded-2xl border transition-all duration-200 ${
    darkMode
      ? "bg-[#2D2D2D] border-[#3D3D3D] text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <div className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`${base} flex items-center gap-3 px-5 py-4 hover:border-[#ff7a00]/50 ${
          isOpen ? "border-[#ff7a00] shadow-sm shadow-[#ff7a00]/10" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Left icon */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
          }`}
        >
          <Briefcase size={16} strokeWidth={2.2} />
        </div>

        {/* Label area */}
        <div className="flex-1 min-w-0 text-left">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[#ff7a00]" />
              <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Loading drives…
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle size={14} />
              <span className="text-sm">{error}</span>
            </div>
          ) : selectedDrive ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold truncate">{selectedDrive.company}</span>
              <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                — {selectedDrive.role}
              </span>
              <span
                className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle(
                  selectedDrive.status,
                  darkMode
                )}`}
              >
                {selectedDrive.status}
              </span>
            </div>
          ) : (
            <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {drives.length === 0
                ? "No active drives available"
                : "Select a placement drive to nominate students"}
            </span>
          )}
        </div>

        <ChevronDown
          size={18}
          strokeWidth={2.2}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && !loading && !error && drives.length > 0 && (
        <div
          className={`absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border shadow-2xl ${
            darkMode
              ? "bg-[#2D2D2D] border-[#3D3D3D] shadow-black/40"
              : "bg-white border-slate-200 shadow-slate-200/60"
          }`}
          role="listbox"
        >
          {/* "No drive" option */}
          <button
            type="button"
            onClick={() => { onDriveChange(null); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors border-b ${
              !selectedDriveId
                ? darkMode ? "bg-[#ff6d34]/10 text-[#ff6d34]" : "bg-orange-50 text-[#ff7a00]"
                : darkMode ? "hover:bg-[#3D3D3D] text-slate-400 border-[#3D3D3D]" : "hover:bg-slate-50 text-slate-500 border-slate-100"
            }`}
            role="option"
            aria-selected={!selectedDriveId}
          >
            <span className="text-sm font-medium">All drives (no filter)</span>
          </button>

          {drives.map((drive) => {
            const isSelected = drive.id === selectedDriveId;
            return (
              <button
                key={drive.id}
                type="button"
                onClick={() => { onDriveChange(drive.id); setIsOpen(false); }}
                className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors ${
                  isSelected
                    ? darkMode ? "bg-[#ff6d34]/10" : "bg-orange-50"
                    : darkMode ? "hover:bg-[#3D3D3D]" : "hover:bg-slate-50"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                {/* Company initial avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    isSelected
                      ? darkMode ? "bg-[#ff6d34]/20 text-[#ff6d34]" : "bg-orange-100 text-[#ff7a00]"
                      : darkMode ? "bg-[#3D3D3D] text-slate-300" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {drive.company?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Drive info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold truncate ${isSelected ? darkMode ? "text-[#ff6d34]" : "text-[#ff7a00]" : ""}`}>
                      {drive.company}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle(
                        drive.status,
                        darkMode
                      )}`}
                    >
                      {drive.status}
                    </span>
                  </div>

                  <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    <span className="flex items-center gap-1">
                      <Briefcase size={11} />
                      {drive.role}
                    </span>
                    {drive.package && (
                      <span className="font-medium text-[#ff7a00]">{drive.package}</span>
                    )}
                    {drive.driveDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {new Date(drive.driveDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {drive.eligibility?.department?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Building2 size={11} />
                        {drive.eligibility.department.slice(0, 2).join(", ")}
                        {drive.eligibility.department.length > 2 && ` +${drive.eligibility.department.length - 2}`}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DriveSelector;
