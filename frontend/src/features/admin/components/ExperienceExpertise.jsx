import React, { useState } from "react";

const EXP_OPTS = [
  "Frontend Architecture",
  "UI/UX Systems",
  "Backend Scaling",
  "Product Strategy",
  "DevOps",
  "Machine Learning",
];

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];

const LEVEL_COLORS = {
  EXPERT: "bg-emerald-50 text-emerald-600 border-emerald-100",
  INTERMEDIATE: "bg-violet-50 text-violet-600 border-violet-100",
  BEGINNER: "bg-blue-50 text-blue-600 border-blue-100",
};

const ExperienceExpertise = ({ register, errors, watch, setValue }) => {
  const expertise = watch("expertise") || [];
  const coreSkills = watch("coreSkills") || [];
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("BEGINNER");
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Toggle expertise area
  const toggleExpertise = (tag) => {
    const updated = expertise.includes(tag)
      ? expertise.filter((t) => t !== tag)
      : [...expertise, tag];
    setValue("expertise", updated, { shouldDirty: true, shouldValidate: true });
  };

  // Add a custom expertise area
  const handleAddCustomExpertise = () => {
    const tag = prompt("Enter custom expertise area:");
    if (!tag || !tag.trim()) return;
    const cleanTag = tag.trim();
    if (!expertise.includes(cleanTag)) {
      setValue("expertise", [...expertise, cleanTag], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Add core skill
  const handleAddCoreSkill = () => {
    if (!newSkillName.trim()) return;
    const updated = [...coreSkills, { name: newSkillName.trim(), level: newSkillLevel }];
    setValue("coreSkills", updated, { shouldDirty: true, shouldValidate: true });
    setNewSkillName("");
    setNewSkillLevel("BEGINNER");
    setShowAddSkill(false);
  };

  // Remove core skill
  const handleRemoveCoreSkill = (index) => {
    const updated = coreSkills.filter((_, i) => i !== index);
    setValue("coreSkills", updated, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="w-full border border-slate-200 border-l-4 border-l-emerald-500 rounded-2xl p-6 md:p-8 bg-white shadow-sm">
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Experience & Expertise
      </h2>
      <p className="text-sm text-slate-500 mt-1.5 mb-6 leading-relaxed">
        Tell us about your professional background and areas of specialization.
      </p>

      {/* Grid Inputs: Designation & Years of Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Current Designation
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Staff Engineer"
            {...register("designation")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all shadow-sm"
          />
          {errors.designation && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.designation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Years of Professional Experience
          </label>
          <select
            {...register("yearsExp")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all shadow-sm"
          >
            <option value="">Select experience</option>
            {["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.yearsExp && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.yearsExp.message}</p>
          )}
        </div>
      </div>

      {/* Expertise Areas Tags */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Expertise Areas
        </label>
        <div className="flex flex-wrap gap-2.5">
          {EXP_OPTS.map((tag) => {
            const on = expertise.includes(tag);
            const isPurple = tag === "UI/UX Systems";

            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleExpertise(tag)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition duration-200 flex items-center gap-1.5 border cursor-pointer ${
                  on
                    ? isPurple
                      ? "bg-violet-50 text-violet-600 border-violet-200"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{tag}</span>
                {on && <span className="text-[10px] font-extrabold opacity-80">×</span>}
              </button>
            );
          })}

          {/* Render extra custom expertise tags */}
          {expertise
            .filter((t) => !EXP_OPTS.includes(t))
            .map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleExpertise(tag)}
                className="rounded-full px-4 py-2 text-xs font-bold bg-violet-50 text-violet-600 border border-violet-200 transition duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{tag}</span>
                <span className="text-[10px] font-extrabold opacity-80">×</span>
              </button>
            ))}

          <button
            type="button"
            onClick={handleAddCustomExpertise}
            className="rounded-full px-4 py-2 text-xs font-bold border border-dashed border-violet-200 bg-transparent text-violet-600 hover:bg-violet-50 transition cursor-pointer"
          >
            + Add Other
          </button>
        </div>
      </div>

      {/* Top Core Skills List */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Top Core Skills
        </label>

        <div className="border border-slate-200 border-dashed rounded-xl overflow-hidden shadow-sm bg-white">
          {coreSkills.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {coreSkills.map((sk, index) => {
                const isReact =
                  sk.name.toLowerCase().includes("react") ||
                  sk.name.toLowerCase().includes("next.js");
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {/* Skill Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isReact ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"
                        }`}
                      >
                        {isReact ? "</>" : "✎"}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{sk.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider border ${
                          LEVEL_COLORS[sk.level] || LEVEL_COLORS.BEGINNER
                        }`}
                      >
                        {sk.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoreSkill(index)}
                        className="text-red-500 hover:text-red-700 transition font-bold p-1 cursor-pointer"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 text-center text-xs text-slate-400">No skills added yet.</div>
          )}

          {/* Inline Form to Add Skill */}
          {showAddSkill ? (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. React.js, Tailwind CSS"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none bg-white focus:border-violet-600"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none bg-white text-slate-700 focus:border-violet-600"
              >
                {SKILL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddCoreSkill}
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="border border-slate-200 hover:bg-slate-100 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddSkill(true)}
              className="w-full py-4 text-center text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition border-t border-slate-100 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="text-sm">⊕</span> Add Core Skill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceExpertise;
