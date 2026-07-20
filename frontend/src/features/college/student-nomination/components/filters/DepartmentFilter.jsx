import { useState, useMemo, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { GraduationCap, ChevronDown, Search, X } from "lucide-react";

const DepartmentFilter = ({
  value,
  onChange,
  departments = ["Computer Science", "Information Technology", "Electronics", "Mechanical"],
}) => {
  const { darkMode } = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [typeQuery, setTypeQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = useMemo(() => {
    if (!value) return "All Departments";
    return value;
  }, [value]);

  const filteredOptions = useMemo(() => {
    const query = typeQuery.trim().toLowerCase();
    if (!query) return departments;
    return departments.filter((dept) =>
      dept.toLowerCase().includes(query)
    );
  }, [typeQuery, departments]);

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
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition-all duration-200 ease-out select-none
          ${
            darkMode
              ? `border-slate-700/60 hover:border-slate-600 bg-[#151D30] ${
                  isOpen ? "border-blue-500/70 ring-4 ring-blue-500/10" : ""
                }`
              : `border-slate-300 hover:border-slate-400 bg-white ${
                  isOpen ? "border-blue-500 ring-4 ring-blue-500/10" : ""
                }`
          }`}
      >
        <GraduationCap
          size={18}
          className={`shrink-0 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        />
        <div className={`flex-1 text-sm font-medium ${darkMode ? "text-white" : "text-slate-700"}`}>
          {displayLabel}
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-500" : darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        />
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-0 right-0 mt-2 z-50 pointer-events-auto rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-64 ${
            darkMode ? "border-slate-700 bg-[#1e293b] text-white" : "border-slate-200 bg-white text-slate-800"
          }`}
        >
          <div
            className={`flex items-center gap-2 px-3 py-2 border-b shrink-0 ${
              darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"
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

          <div className="overflow-y-auto flex-1 py-1 custom-scrollbar">
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                triggerChange("");
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer font-medium transition-colors ${
                value === "" ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600") : (darkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-50")
              }`}
            >
              All Departments
            </div>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((dept, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    triggerChange(dept);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === dept ? (darkMode ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600") : (darkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-50")
                  }`}
                >
                  {dept}
                </div>
              ))
            ) : (
              <div className={`px-4 py-3 text-xs text-center select-none italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                No matching departments found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentFilter;