import { useState, useMemo, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Building2, ChevronDown, Search, X } from "lucide-react";

const CompanyFilter = ({
  value,
  onChange,
  companies = ["Google", "Lenovo", "Apple", "Microsoft"],
}) => {
  const { darkMode } = useOutletContext();
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

  // Compute text to display inside the selected header box
  const displayLabel = useMemo(() => {
    if (!value) return "All Companies";
    return value;
  }, [value]);

  // Filter dropdown selections dynamically by typed matches
  const filteredOptions = useMemo(() => {
    const query = typeQuery.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((company) =>
      company.toLowerCase().includes(query)
    );
  }, [typeQuery, companies]);

  // FIX: Formats a mock event structure so the main page's e.target.value handler won't throw errors
  const triggerChange = (targetValue) => {
    onChange({
      target: {
        value: targetValue,
      },
    });
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
        <Building2
          size={18}
          className={`shrink-0 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        />

        <div className={`flex-1 text-sm font-medium ${darkMode ? "text-white" : "text-slate-700"}`}>
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
          // FIX: Added explicit high z-index (z-50) and pointer-events-auto to command hover priority over tables
          className={`absolute left-0 right-0 mt-2 z-50 pointer-events-auto rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-64 ${
            darkMode
              ? "border-[#3D3D3D] bg-[#2D2D2D] text-white"
              : "border-slate-200 bg-white text-slate-800"
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
              className="flex-1 bg-transparent border-none outline-none text-xs py-1 placeholder:text-slate-400"
              autoFocus
            />
            {typeQuery && (
              <button
                type="button"
                onClick={() => setTypeQuery("")}
                className={`p-0.5 rounded-full ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"}`}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Scrollable Options List */}
          <div className="overflow-y-auto flex-1 py-1 custom-scrollbar">
            <div
              onMouseDown={(e) => {
                e.preventDefault(); 
                triggerChange("");
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer font-medium transition-colors ${
                value === ""
                  ? darkMode
                    ? "bg-[#ff6d34] text-white"
                    : "bg-orange-50 text-[#ff7a00]"
                  : darkMode
                  ? "hover:bg-slate-700/60"
                  : "hover:bg-slate-50"
              }`}
            >
              All Companies
            </div>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((company, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    triggerChange(company);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === company
                      ? darkMode
                        ? "bg-[#ff6d34] text-white"
                        : "bg-orange-50 text-[#ff7a00]"
                      : darkMode
                      ? "hover:bg-slate-700/60"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {company}
                </div>
              ))
            ) : (
              <div
                className={`px-4 py-3 text-xs text-center select-none italic ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                No matching companies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyFilter;