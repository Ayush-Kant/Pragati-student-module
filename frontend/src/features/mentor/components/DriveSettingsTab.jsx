import { useState } from "react";
import { Plus } from "lucide-react";

export default function DriveSettingsTab({ data }) {
  const [score, setScore] = useState(data.minimumScore);

  const [skills, setSkills] = useState(
    data.requiredSkills.map((skill) => ({
      name: skill,
      checked: true,
    }))
  );

  const toggleSkill = (index) => {
    setSkills((prev) =>
      prev.map((skill, i) =>
        i === index
          ? { ...skill, checked: !skill.checked }
          : skill
      )
    );
  };

  const addSkill = () => {
    const name = prompt("Enter Skill");

    if (!name) return;

    setSkills([
      ...skills,
      {
        name,
        checked: true,
      },
    ]);
  };

  const handleSave = () => {
    console.log({
      minimumScore: score,
      requiredSkills: skills.filter(s => s.checked),
    });

    alert("Configuration Saved");
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <select className="border rounded-lg px-4 py-2">

          <option>Full Stack Internship</option>

          <option>Frontend Internship</option>

          <option>Backend Internship</option>

        </select>

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Save Configuration
        </button>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Skills */}

        <div className="border rounded-xl p-5 bg-white">

          <div className="flex justify-between items-center mb-5">

            <div>

              <h2 className="text-lg font-semibold">

                Required Skills

              </h2>

              <p className="text-gray-500 text-sm">

                Select the technical competencies.

              </p>

            </div>

            <button
              onClick={addSkill}
              className="border rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-100"
            >
              <Plus size={16} />

              Add Skill
            </button>

          </div>

          <div className="grid grid-cols-2 gap-3">

            {skills.map((skill, index) => (

              <label
                key={index}
                className="border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
              >

                <input
                  type="checkbox"
                  checked={skill.checked}
                  onChange={() => toggleSkill(index)}
                />

                {skill.name}

              </label>

            ))}

          </div>

        </div>

        {/* Score */}

        <div className="border rounded-xl p-5 bg-white flex flex-col justify-center">

          <h2 className="text-lg font-semibold">

            Minimum Readiness Score

          </h2>

          <p className="text-gray-500 text-sm mb-8">

            Threshold for automatic shortlisting

          </p>

          <div className="text-center">

            <h1 className="text-6xl font-bold text-blue-600">

              {score}%

            </h1>

          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="mt-8"
          />

          <div className="flex justify-between text-xs text-gray-400 mt-2">

            <span>RELAXED</span>

            <span>STRICT</span>

          </div>

        </div>

      </div>

    </div>
  );
}