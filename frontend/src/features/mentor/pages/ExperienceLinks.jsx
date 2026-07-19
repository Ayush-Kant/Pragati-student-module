import React, { useState } from "react";
import {
  Code2,
  PenTool,
  Star,
  Trash2,
  PlusCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/layout/OnboardingLayout";

const ExperienceLinks = () => {

  const navigate = useNavigate();

  // FORM STATES
  const [designation, setDesignation] =
    useState("");

  const [experience, setExperience] =
    useState("");

  // EXPERTISE TAGS
  const defaultExpertise = [
    "Frontend Architecture",
    "UI/UX Systems",
    "Backend Scaling",
    "Product Strategy",
    "DevOps",
    "Machine Learning",
  ];

  const [selectedExpertise, setSelectedExpertise] =
    useState([
      "Frontend Architecture",
      "UI/UX Systems",
    ]);

  const [expertiseList, setExpertiseList] =
    useState(defaultExpertise);

  const [showExpertiseInput, setShowExpertiseInput] =
    useState(false);

  const [newExpertise, setNewExpertise] =
    useState("");

  // SKILLS

const [skills, setSkills] = useState([
  {
    name: "React.js & Next.js",
    level: "EXPERT",
    icon: "code",
  },
  {
    name: "System Design",
    level: "INTERMEDIATE",
    icon: "design",
  },
  {
    name: "DSA",
    level: "EXPERT",
    icon: "star",
  },
]);



 /* const [skills, setSkills] = useState([
    {
      name: "React.js & Next.js",
      level: "EXPERT",
      icon: "💻",
    },
    {
      name: "System Design",
      level: "INTERMEDIATE",
      icon: "🖊️",
    },
  ]);
  */

  // MODAL
  const [showSkillModal, setShowSkillModal] =
    useState(false);

  const [skillName, setSkillName] =
    useState("");

  const [skillLevel, setSkillLevel] =
    useState("BEGINNER");

  // TOGGLE EXPERTISE
  const toggleExpertise = (item) => {

    if (selectedExpertise.includes(item)) {

      setSelectedExpertise(
        selectedExpertise.filter(
          (exp) => exp !== item
        )
      );

    } else {

      setSelectedExpertise([
        ...selectedExpertise,
        item,
      ]);

    }
  };

  // ADD NEW EXPERTISE
  const handleAddExpertise = () => {

    if (!newExpertise.trim()) return;

    setExpertiseList([
      ...expertiseList,
      newExpertise,
    ]);

    setSelectedExpertise([
      ...selectedExpertise,
      newExpertise,
    ]);

    setNewExpertise("");

    setShowExpertiseInput(false);
  };

  // ADD SKILL
  const handleAddSkill = () => {

  if (!skillName.trim()) return;

  let skillIcon = "default";

  const lowerSkill =
    skillName.toLowerCase();

  // AUTO ICONS
  if (
    lowerSkill.includes("react") ||
    lowerSkill.includes("next") ||
    lowerSkill.includes("frontend")
  ) {
    skillIcon = "code";
  }

  else if (
    lowerSkill.includes("design") ||
    lowerSkill.includes("ui") ||
    lowerSkill.includes("teaching") ||
    lowerSkill.includes("ux")
  ) {
    skillIcon = "design";
  }

  else if (
    lowerSkill.includes("dsa") ||
    lowerSkill.includes("Communication") ||
    lowerSkill.includes("algorithm")
  ) {
    skillIcon = "star";
  }

  const newSkill = {
    name: skillName,
    level: skillLevel,
    icon: skillIcon,
  };

  setSkills([
    ...skills,
    newSkill,
  ]);

  setSkillName("");
  setSkillLevel("BEGINNER");
  setShowSkillModal(false);
};

  // DELETE SKILL
  const deleteSkill = (index) => {

    const updated = skills.filter(
      (_, i) => i !== index
    );

    setSkills(updated);
  };

  return (

    <OnboardingLayout
      step={3}
      title=""
      subtitle=""
    >

      <div className="max-w-6xl mx-auto">

        {/* MAIN CARD */}
        <div className="relative bg-white border border-gray-200 rounded-[35px] shadow-sm p-10 md:p-14 overflow-hidden">

          {/* GREEN LEFT BORDER */}
          <div className="absolute left-0 top-0 h-full w-[6px] bg-green-500"></div>

          {/* HEADING */}
          <div className="pl-4">

            <h1 className="text-5xl font-bold text-gray-900">
              Experience & Expertise
            </h1>

            <p className="text-gray-500 mt-5 text-xl leading-9">
              Tell us about your professional background
              and areas of specialization.
            </p>

          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">

            {/* DESIGNATION */}
            <div>

              <label className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Current Designation
              </label>

              <input
                type="text"
                value={designation}
                onChange={(e) =>
                  setDesignation(e.target.value)
                }
                placeholder="e.g. Senior Staff Engineer"
                className="w-full mt-3 border border-gray-300 rounded-2xl px-6 py-5 text-lg outline-none focus:ring-2 focus:ring-green-400"
              />

            </div>

            {/* EXPERIENCE */}
            <div>

              <label className="text-sm font-bold uppercase tracking-wide text-gray-500">
                Years of Professional Experience
              </label>

              <select
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                className="w-full mt-3 border border-gray-300 rounded-2xl px-6 py-5 text-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >

                <option value="">
                  Select experience
                </option>

                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
                <option>5+ Years</option>
                <option>10+ Years</option>

              </select>

            </div>

          </div>

          {/* EXPERTISE */}
          <div className="mt-14">

            <label className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Expertise Areas
            </label>

            <div className="flex flex-wrap gap-4 mt-6">

              {expertiseList.map((item, index) => {

                const selected =
                  selectedExpertise.includes(item);

                return (

                  <button
                    key={index}
                    onClick={() =>
                      toggleExpertise(item)
                    }
                    className={`px-6 py-3 rounded-full border text-lg font-medium transition

                    ${
                      selected
                        ? "border-purple-500 text-purple-600 bg-purple-50"
                        : "border-gray-300 text-gray-700 bg-white"
                    }`}
                  >

                    {item}
                    {selected && " ✕"}

                  </button>

                );
              })}

              {/* ADD OTHER */}
              {!showExpertiseInput ? (

                <button
                  onClick={() =>
                    setShowExpertiseInput(true)
                  }
                  className="px-6 py-3 rounded-full border border-purple-200 bg-purple-50 text-purple-600 text-lg font-medium"
                >
                  + Add Other
                </button>

              ) : (

                <div className="flex gap-3">

                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) =>
                      setNewExpertise(
                        e.target.value
                      )
                    }
                    placeholder="Enter expertise"
                    className="border border-gray-300 rounded-full px-5 py-3 outline-none text-lg"
                  />

                  <button
                    onClick={handleAddExpertise}
                    className="bg-purple-600 text-white px-5 rounded-full text-lg"
                  >
                    Save
                  </button>

                </div>

              )}

            </div>

          </div>

          {/* SKILLS */}
          <div className="mt-16">

            <label className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Top Core Skills
            </label>

            <div className="mt-6 border border-dashed border-gray-300 rounded-3xl p-6">

              {/* SKILLS LIST */}
              <div className="space-y-5">

             {/* /*{skills.map((skill, index) => (

                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between"
                  >

                    <div className="flex items-center gap-5">

                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                        {skill.icon}
                      </div>

                      <h3 className="font-semibold text-xl text-gray-800">
                        {skill.name}
                      </h3>

                    </div>

                    <div className="flex items-center gap-5">

                      <span
                        className={`px-5 py-2 rounded-xl text-sm font-semibold

                        ${
                          skill.level === "EXPERT"
                            ? "bg-green-100 text-green-700"
                            : skill.level === "INTERMEDIATE"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {skill.level}
                      </span>

                      <button
                        onClick={() =>
                          deleteSkill(index)
                        }
                        className="text-red-500 text-2xl"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                ))}
                  /*/}

               {skills.map((skill, index) => (

  <div
    key={index}
    className="border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between hover:shadow-md transition"
  >

    <div className="flex items-center gap-5">

      {/* ICON BOX */}
      {/* <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">

        {skill.icon === "code" && (
          <Code2
            size={30}
            className="text-green-600"
          />
        )}

        {skill.icon === "design" && (
          <PenTool
            size={28}
            className="text-purple-600"
          />
        )}

        {skill.icon === "star" && (
          <Star
            size={28}
            className="text-yellow-500 fill-yellow-400"
          />
        )}

      </div>  */}


<div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">

  {/* REACT */}
  {skill.icon === "code" && (
    <Code2
      size={30}
      className="text-green-600"
    />
  )}

  {/* SYSTEM DESIGN */}
  {skill.icon === "design" && (
    <PenTool
      size={28}
      className="text-purple-600"
    />
  )}

  {/* DSA */}
  {skill.icon === "star" && (
    <Star
      size={28}
      className="text-yellow-500 fill-yellow-400"
    />
  )}

  {/* DEFAULT ICON FOR NEW SKILLS */}
  {!["code", "design", "star"].includes(skill.icon) && (
    <Code2
      size={28}
      className="text-gray-500"
    />
  )}

</div>




      {/* SKILL NAME */}
      <h3 className="font-semibold text-2xl text-gray-800">
        {skill.name}
      </h3>

    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-5">

      <span
        className={`px-5 py-2 rounded-xl text-sm font-semibold

        ${
          skill.level === "EXPERT"
            ? "bg-green-100 text-green-700"
            : skill.level === "INTERMEDIATE"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {skill.level}
      </span>

      {/* DELETE ICON */}
      <button
        onClick={() => deleteSkill(index)}
        className="text-red-500 hover:scale-110 transition"
      >

        <Trash2 size={24} />

      </button>

    </div>

  </div>

))}




              </div>

              {/* ADD SKILL */}
              <button
                onClick={() =>
                  setShowSkillModal(true)
                }
                className="w-full mt-6 border border-dashed border-gray-300 rounded-2xl py-6 text-xl text-gray-600 hover:bg-gray-50 transition"
              >
               {/* ⊕ Add Core Skill */}
               <div className="flex items-center justify-center gap-3">

  <PlusCircle size={24} />

  <span>Add Core Skill</span>

</div>
              </button>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-between mt-16">

            {/* PREVIOUS */}
            <button
              onClick={() =>
                navigate(
                  "/mentor/onboarding/professional-profile"
                )
              }
              className="border border-gray-300 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
            >
              ← Previous
            </button>

            {/* NEXT */}
            <button
              onClick={() =>
                navigate(
                  "/mentor/onboarding/availability"
                )
              }
              className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition"
            >
              Continue to Availability →
            </button>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-10">

          <p className="text-gray-500 text-lg">
            Need help?
            <span className="text-purple-600 font-semibold ml-2">
              Contact Support
            </span>
          </p>

          <p className="text-gray-400 text-sm mt-5">
            © 2024 UPTOSKILLS MENTORSHIP PLATFORM
          </p>

        </div>

      </div>

      {/* MODAL */}
      {showSkillModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-[420px]">

            <h2 className="text-3xl font-bold mb-8">
              Add Core Skill
            </h2>

            <input
              type="text"
              value={skillName}
              onChange={(e) =>
                setSkillName(e.target.value)
              }
              placeholder="Skill Name"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-5 outline-none text-lg"
            />

            <select
              value={skillLevel}
              onChange={(e) =>
                setSkillLevel(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-8 outline-none text-lg"
            >

              <option>BEGINNER</option>
              <option>INTERMEDIATE</option>
              <option>EXPERT</option>

            </select>

            <div className="flex justify-end gap-4">

              <button
                onClick={() =>
                  setShowSkillModal(false)
                }
                className="px-6 py-3 border rounded-2xl text-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSkill}
                className="px-6 py-3 bg-purple-600 text-white rounded-2xl text-lg"
              >
                Save Skill
              </button>

            </div>

          </div>

        </div>

      )}

    </OnboardingLayout>
  );
};

export default ExperienceLinks;