import { useState, useMemo, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarDays, ChevronDown, Search, X } from "lucide-react";

const currentYear = new Date().getFullYear();
const defaultBatches = Array.from(
  { length: 6 },
  (_, index) => (currentYear - index).toString()
);

const BatchFilter = ({ value, onChange, batches = defaultBatches }) => {
  // Safe context fallback prevents crashes outside Outlet context
  const { darkMode = false } = useOutletContext() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute label shown in the selected header box
  const displayLabel = useMemo(() => {
    if (!value) return "All Batches";
    return value;
  }, [value]);

  // Filter options dynamically based on search query
  const filteredOptions = useMemo(() => {
    const query = typeQuery.trim().toLowerCase();
    if (!query) return batches;
    return batches.filter((batch) =>
      batch.toString().toLowerCase().includes(query)
    );
  }, [typeQuery, batches]);

  // Formats synthetic target event structure safely
  const triggerChange = (targetValue) => {
    if (onChange) {
      onChange({
        target: {
          value: targetValue,
        },
      });
    }
    setIsOpen(false);
    setTypeQuery("");
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Selection Box Shell Frame */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition-all duration-200 ease-out select-none
          ${
            darkMode
              ? `border-[#3D3D3D] hover:border-[#4D4D4D] bg-[#2D2D2D] ${
                  isOpen ? "border-[#ff6d34]/70 ring-4 ring-[#ff6d34]/10" : ""
                }`
              : `border-slate-300 hover:border-slate-400 bg-white ${
                  isOpen ? "border-[#ff7a00] ring-4 ring-[#ff7a00]/10" : ""
                }`
          }`}
      >
        <CalendarDays
          size={18}
          className={`shrink-0 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        />
        <div className={`flex-1 text-sm font-medium truncate ${darkMode ? "text-white" : "text-slate-700"}`}>
          {displayLabel}
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? `rotate-180 ${darkMode ? "text-[#ff6d34]" : "text-[#ff7a00]"}` : darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        />
      </div>

      {/* Floating Dropdown Layer */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-0 right-0 mt-2 z-50 pointer-events-auto rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-64 ${
            darkMode ? "border-[#3D3D3D] bg-[#2D2D2D] text-white" : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          {/* Internal Input Search Engine */}
          <div
            className={`flex items-center gap-2 px-3 py-2 border-b shrink-0 ${
              darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-slate-100 bg-slate-50"
            }`}
          >
            <Search size={14} className={darkMode ? "text-slate-500" : "text-slate-400"} />
            <input
              type="text"
              placeholder="Type to filter..."
              value={typeQuery}
              onChange={(e) => setTypeQuery(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-xs py-1 ${
                darkMode
                  ? "text-white placeholder:text-slate-500"
                  : "text-slate-800 placeholder:text-slate-400"
              }`}
              autoFocus
            />
            {typeQuery && (
              <button
                type="button"
                onClick={() => setTypeQuery("")}
                aria-label="Clear batch filter search"
                className={`p-0.5 rounded-full ${darkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-200 text-slate-600"}`}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Scrollable Options List */}
          <div
            className={`overflow-y-auto flex-1 py-1 text-sm
              [&::-webkit-scrollbar]:w-1.5
              ${
                darkMode
                  ? "[&::-webkit-scrollbar-track]:bg-[#2D2D2D] [&::-webkit-scrollbar-thumb]:bg-[#3D3D3D] hover:[&::-webkit-scrollbar-thumb]:bg-[#4D4D4D] [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-thin] [scrollbar-color:#3D3D3D_#2D2D2D]"
                  : "[&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-thin] [scrollbar-color:#e2e8f0_#ffffff]"
              }`}
          >
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                triggerChange("");
              }}
              className={`px-4 py-2.5 cursor-pointer font-medium transition-colors ${
                value === "" ? (darkMode ? "bg-[#ff6d34] text-white" : "bg-orange-50 text-[#ff7a00]") : (darkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-50")
              }`}
            >
              All Batches
            </div>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((batch) => (
                <div
                  key={batch}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    triggerChange(batch.toString());
                  }}
                  className={`px-4 py-2.5 cursor-pointer transition-colors ${
                    value === batch.toString() ? (darkMode ? "bg-[#ff6d34] text-white" : "bg-orange-50 text-[#ff7a00]") : (darkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-50")
                  }`}
                >
                  {batch}
                </div>
              ))
            ) : (
              <div className={`px-4 py-8 text-xs text-center select-none italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                No matching batches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchFilter;