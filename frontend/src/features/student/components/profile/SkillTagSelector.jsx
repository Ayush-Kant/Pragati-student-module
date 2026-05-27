// SkillTagSelector.jsx
// Purpose: Multi-select autocomplete tag input that lets students add and remove skill tags

import { useState, useRef } from "react";

const SUGGESTED_SKILLS = [
  "React", "Node.js", "Python", "Java", "C++", "JavaScript", "TypeScript",
  "SQL", "MongoDB", "Git", "HTML", "CSS", "Express", "Django", "Spring Boot",
  "Docker", "AWS", "REST APIs", "GraphQL", "Figma", "Data Structures",
];

const SkillTagSelector = ({ skills = [], onChange }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Filter suggestions — jo already selected nahi aani input match karto
  const filtered = SUGGESTED_SKILLS.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !skills.includes(s)
  );

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === "Backspace" && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="w-full">
      {/* Tags + Input Box */}
      <div
        className="min-h-[44px] w-full flex flex-wrap gap-2 items-center px-3 py-2 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Existing skill tags */}
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 text-blue-400 hover:text-blue-700 font-bold leading-none"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
          className="flex-1 min-w-[140px] outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input.length > 0 && filtered.length > 0 && (
        <div className="relative z-10">
          <ul className="absolute top-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
            {filtered.map((s) => (
              <li
                key={s}
                onMouseDown={() => addSkill(s)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                {s}
              </li>
            ))}
            {/* Custom skill add option */}
            {!SUGGESTED_SKILLS.map(s => s.toLowerCase()).includes(input.toLowerCase()) && (
              <li
                onMouseDown={() => addSkill(input)}
                className="px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 cursor-pointer border-t border-gray-100"
              >
                + Add "{input}"
              </li>
            )}
          </ul>
        </div>
      )}

      <p className="mt-1.5 text-xs text-gray-400">
        Press <kbd className="bg-gray-100 px-1 rounded text-gray-500">Enter</kbd> to add a custom skill · <kbd className="bg-gray-100 px-1 rounded text-gray-500">Backspace</kbd> to remove last
      </p>
    </div>
  );
};

export default SkillTagSelector;

