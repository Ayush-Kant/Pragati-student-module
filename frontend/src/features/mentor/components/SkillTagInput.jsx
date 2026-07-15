import React, { useEffect, useState } from "react";
import { getSkillSuggestions } from "../services/certificateService";

const SkillTagInput = ({ watch, setValue }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const skills = watch("skills") || [];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getSkillSuggestions(input);

        if (Array.isArray(data)) {
          setSuggestions(data);
        } else if (Array.isArray(data.skills)) {
          setSuggestions(data.skills);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (input.trim().length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const addSkill = (skill) => {
    if (!skill.trim()) return;

    if (skills.includes(skill)) return;

    setValue("skills", [...skills, skill]);

    setInput("");
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    setValue(
      "skills",
      skills.filter((item) => item !== skill)
    );
  };

  return (
    <div className="space-y-3">
      <div className="border rounded-xl p-3 min-h-[90px] flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill}
            className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-2 text-sm"
          >
            {skill}

            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="font-bold"
            >
              ×
            </button>
          </div>
        ))}

        <input
          type="text"
          value={input}
          placeholder="Add skill..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill(input);
            }
          }}
          className="flex-1 min-w-[120px] outline-none"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="border rounded-lg bg-white shadow-sm">
          {suggestions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillTagInput;