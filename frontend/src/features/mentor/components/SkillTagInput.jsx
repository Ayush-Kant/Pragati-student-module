import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getSkillSuggestions } from "../services/certificateService";

const SkillTagInput = ({ watch, setValue }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const skills = watch("skills") || [];

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getSkillSuggestions(input);
        setSuggestions(Array.isArray(data) ? data : data.skills || []);
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
    if (!skill.trim() || skills.includes(skill)) return;
    setValue("skills", [...skills, skill]);
    setInput("");
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    setValue("skills", skills.filter((item) => item !== skill));
  };

  return (
    <div className="relative space-y-3">
      <div className="flex min-h-[100px] flex-wrap content-start gap-2 rounded-lg border border-gray-200 bg-white p-3">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1.5 text-sm text-gray-800"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <input
          type="text"
          value={input}
          placeholder="Add another skill..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill(input);
            }
          }}
          className="min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
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