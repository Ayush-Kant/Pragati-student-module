import React, { useState, useRef, useEffect } from "react";
import { Upload, HelpCircle, X } from "lucide-react";

export default function Step1BasicInfo({
  courseData,
  onUpdate,
  onNext,
  isValid,
}) {
  const [tagInput, setTagInput] = useState("");
  const [touched, setTouched] = useState({});
  const editorRef = useRef(null);

  // Sync initial data into the editor ONLY once when it mounts
  useEffect(() => {
    if (
      editorRef.current &&
      !editorRef.current.innerHTML &&
      courseData.fullDescription
    ) {
      editorRef.current.innerHTML = courseData.fullDescription;
    }
  }, []); // Empty dependency array stops React from resetting your cursor!

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!courseData.skillTags.includes(tagInput.trim())) {
        onUpdate({ skillTags: [...courseData.skillTags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    onUpdate({
      skillTags: courseData.skillTags.filter((_, i) => i !== indexToRemove),
    });
  };

  // Safe formatting without breaking cursor context
  const applyFormat = (tag, isBlock = false) => {
    const selection = window.getSelection();
    if (!selection.rangeCount || !editorRef.current) return;

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;

    if (isBlock) {
      const blockElem = document.createElement(tag);
      blockElem.textContent = range.toString() || "Quote text";
      range.deleteContents();
      range.insertNode(blockElem);
    } else {
      const element = document.createElement(tag);
      element.appendChild(range.extractContents());
      range.insertNode(element);
    }

    // Save changes to parent state
    onUpdate({ fullDescription: editorRef.current.innerHTML });
  };

  const drives = [
    { driveId: 1, driveName: "Winter Backend Engineering cohort 2026" },
    { driveId: 2, driveName: "Happy" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Form Content Pane Column */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 space-y-6">
        {/* Title Input Element Container */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-700">
              Course Title <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400">
              {courseData.title.length}/100
            </span>
          </div>
          <input
            type="text"
            maxLength={100}
            value={courseData.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            onBlur={() => handleBlur("title")}
            placeholder="Enter course title"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              touched.title && courseData.title.trim().length < 3
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {touched.title && courseData.title.trim().length < 3 && (
            <p className="text-red-500 text-xs mt-1">
              Title must be at least 3 characters long.
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-gray-700">
              Short Description <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400">
              {courseData.shortDescription.length}/200
            </span>
          </div>
          <textarea
            maxLength={200}
            rows={2}
            value={courseData.shortDescription}
            onChange={(e) => onUpdate({ shortDescription: e.target.value })}
            placeholder="Enter a short description about the course"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Full Description Rich Text Block Area Fixed */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Description <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex flex-wrap gap-4 text-sm font-bold text-gray-600 select-none">
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("")}
                className="font-serif text-gray-400"
              >
                Normal
              </span>
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("b")}
                className="cursor-pointer font-bold hover:text-blue-600"
              >
                B
              </span>
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("i")}
                className="cursor-pointer italic hover:text-blue-600"
              >
                I
              </span>
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("u")}
                className="cursor-pointer underline hover:text-blue-600"
              >
                U
              </span>
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("blockquote", true)}
                className="cursor-pointer font-normal hover:text-blue-600"
              >
                Quotes
              </span>
              <span
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("li", true)}
                className="cursor-pointer font-normal hover:text-blue-600"
              >
                List Item
              </span>
            </div>

            <div
              id="description"
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                onUpdate({ fullDescription: e.currentTarget.innerHTML });
              }}
              className="w-full p-3 min-h-[200px] focus:outline-none prose max-w-none bg-white"
              placeholder="Write rich course description here..."
            />
          </div>
        </div>

        {/* Double Input Category Layout Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={courseData.category}
              onChange={(e) => onUpdate({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
            >
              <option value="">Select category</option>
              <option value="tech">Web Development</option>
              <option value="design">UI/UX Design</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              value={courseData.subcategory}
              onChange={(e) => onUpdate({ subcategory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
            >
              <option value="">Select subcategory</option>
              {courseData.category === "tech" && (
                <option value="frontend">Frontend Development</option>
              )}
              {courseData.category === "tech" && (
                <option value="backend">Backend Development</option>
              )}
            </select>
          </div>
        </div>

        {/* Level Radio Toggles */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Level <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {["Beginner", "Intermediate", "Advanced", "All Levels"].map(
              (lvl) => (
                <label
                  key={lvl}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="level"
                    checked={courseData.level === lvl}
                    onChange={() => onUpdate({ level: lvl })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  {lvl}
                </label>
              ),
            )}
          </div>
        </div>

        {/* Language & Estimated Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              value={courseData.language}
              onChange={(e) => onUpdate({ language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
            >
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Spanish">Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Estimated Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={courseData.estimatedDuration}
              onChange={(e) => onUpdate({ estimatedDuration: e.target.value })}
              placeholder="e.g., 8h 30m or 10 hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Skill Tag Inputs */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Skill Tags <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex flex-wrap gap-2 p-2 border rounded-lg bg-white ${
              touched.tags && courseData.skillTags.length === 0
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            {courseData.skillTags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1 font-medium"
              >
                {tag}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => removeTag(idx)}
                />
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              onBlur={() => handleBlur("tags")}
              placeholder={
                courseData.skillTags.length === 0
                  ? "Type and press Enter to add tags"
                  : ""
              }
              className="flex-1 min-w-[150px] outline-none text-sm"
            />
          </div>
          {touched.tags && courseData.skillTags.length === 0 && (
            <p className="text-red-500 text-xs mt-1">
              Minimum 1 skill tag is required.
            </p>
          )}
        </div>

        {/* Recruitment Drive ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Drive ID <span className="text-red-500">*</span>
          </label>
          <select
            value={courseData.driveId}
            onChange={(e) => onUpdate({ driveId: e.target.value })}
            onBlur={() => handleBlur("driveId")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none bg-white ${
              touched.driveId && !courseData.driveId
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select active recruitment drive</option>
            {drives.map((drive) => (
              <option value={drive.driveId}>{drive.driveName}</option>
            ))}
          </select>
          {touched.driveId && !courseData.driveId && (
            <p className="text-red-500 text-xs mt-1">
              You must select an active recruitment drive assignment.
            </p>
          )}
        </div>
      </div>

      {/* Right Sidebar Utility Column */}
      <div className="space-y-6">
        {/* Image Thumbnail Drop Box */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Thumbnail <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition-colors">
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 mb-1">
              Upload course thumbnail
            </span>
            <span className="text-xs text-gray-400 mb-4">
              Recommended size: 1280×720px
              <br />
              Max file size: 2MB
            </span>
            <input
              id="file_input"
              type="file"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="mt-4 bg-blue-50 p-3 rounded-lg text-xs space-y-1 text-gray-700 border border-blue-100">
            <div className="flex items-center gap-1 font-bold text-blue-800 mb-1">
              <HelpCircle size={14} /> What makes a good thumbnail?
            </div>
            <p>• Use high-quality images</p>
            <p>• Keep text minimal and readable</p>
            <p>• Use 16:9 aspect ratio guidelines</p>
          </div>
        </div>

        {/* Global Radio Controls Container */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Course Visibility
          </label>
          <div className="space-y-3">
            {[
              {
                id: "Draft",
                label: "Draft",
                desc: "Only admins and assignees can see this course",
              },
              {
                id: "Published",
                label: "Published",
                desc: "Course will be visible to all assigned learners",
              },
              {
                id: "Private",
                label: "Private",
                desc: "Only specified targeted users can access",
              },
            ].map((v) => (
              <label
                key={v.id}
                className="flex items-start gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={courseData.visibility === v.id}
                  onChange={() => onUpdate({ visibility: v.id })}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-800">
                    {v.label}
                  </span>
                  <span className="block text-xs text-gray-400">{v.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="col-span-1 lg:col-span-3 bg-white border border-gray-200 p-4 rounded-xl flex justify-end gap-3 items-center mt-6">
        <button
          disabled={!isValid}
          onClick={onNext}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Curriculum →
        </button>
      </div>
    </div>
  );
}
