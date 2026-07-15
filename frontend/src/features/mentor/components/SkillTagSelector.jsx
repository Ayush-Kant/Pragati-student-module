import React, { useState } from "react";
import { Search, Tag, X, Plus } from "lucide-react";

export default function SkillTagSelector({ watch, setValue, errors, skillsList }) {
  const selectedSkills = watch("skillTags") || [];
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter out already selected skills
  const filteredSuggestions = skillsList.filter(
    (skill) =>
      skill.toLowerCase().includes(search.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const addSkill = (skillName) => {
    const cleaned = skillName.trim();
    if (cleaned && !selectedSkills.includes(cleaned)) {
      setValue("skillTags", [...selectedSkills, cleaned]);
    }
    setSearch("");
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    setValue(
      "skillTags",
      selectedSkills.filter((s) => s !== skillToRemove)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (search.trim()) {
        addSkill(search);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Required Skills</h3>
          <p className="text-xs text-gray-500">Specify the technical skills required for this assessment.</p>
        </div>
      </div>

      {/* Selected Chips */}
      {selectedSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-1">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="w-3.5 h-3.5 rounded-full bg-blue-200/50 hover:bg-blue-300/60 flex items-center justify-center text-blue-800 text-[10px]"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">No skills selected yet. Search or enter custom tags below.</p>
      )}

      {/* Search Input and Suggestions */}
      <div className="relative">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search or enter custom skill..."
            className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
              errors.skillTags ? "border-red-500" : "border-gray-200"
            } outline-none focus:border-blue-500 transition-all text-sm`}
          />
          {search.trim() && (
            <button
              type="button"
              onClick={() => addSkill(search)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800 font-semibold text-xs gap-0.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>

        {/* Suggestion Dropdown */}
        {showSuggestions && search.trim() && filteredSuggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={() => addSkill(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-xs text-gray-700 font-medium transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {errors.skillTags && (
        <p className="text-xs text-red-500 font-medium">{errors.skillTags.message}</p>
      )}
    </div>
  );
}
