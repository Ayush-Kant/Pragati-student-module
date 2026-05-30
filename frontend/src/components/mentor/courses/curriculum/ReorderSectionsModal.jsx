import React, { useState, useEffect } from "react";
import { GripVertical, X } from "lucide-react";

export default function ReorderSectionsModal({ modules, onClose, onSave }) {
  // Local state initialized with current modules prop
  const [localSections, setLocalSections] = useState([]);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragItem, setDragItem] = useState(null);

  useEffect(() => {
    if (modules) {
      const deepClone = JSON.parse(JSON.stringify(modules));
      setLocalSections(deepClone);
    }
  }, [modules]);

  // Reorder whole modules via buttons
  const moveSection = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= localSections.length) return;
    const reordered = [...localSections];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, removed);
    setLocalSections(reordered);
  };

  // Reorder lectures inside a module via buttons (FIXED property name)
  const moveLesson = (moduleIdx, lectureIdx, direction) => {
    const nextIndex = lectureIdx + direction;
    const moduleLectures = localSections[moduleIdx].lectures || []; // Fixed: .lessons -> .lectures
    if (nextIndex < 0 || nextIndex >= moduleLectures.length) return;

    const updated = [...localSections];
    const updatedLectures = [...moduleLectures];
    const [removed] = updatedLectures.splice(lectureIdx, 1);
    updatedLectures.splice(nextIndex, 0, removed);

    updated[moduleIdx].lectures = updatedLectures; // Fixed: .lessons -> .lectures
    setLocalSections(updated);
  };

  const handleSaveSubmit = () => {
    onSave(localSections);
    onClose();
  };

  // --- HTML5 Drag & Drop Logic ---
  const handleDragStart = (type, moduleIndex, lectureIndex = null) => {
    if (!reorderMode) return;
    setDragItem({ type, moduleIndex, lessonIndex: lectureIndex }); // Kept state shape matching your drop handlers
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop targets to function
  };

  const handleDropModule = (targetModuleIndex) => {
    if (
      !dragItem ||
      dragItem.type !== "module" ||
      dragItem.moduleIndex === targetModuleIndex
    )
      return;

    const updated = [...localSections];
    const [moved] = updated.splice(dragItem.moduleIndex, 1);
    updated.splice(targetModuleIndex, 0, moved);

    setLocalSections(updated);
    setDragItem(null);
  };

  const handleDropLesson = (e, targetModuleIndex, targetLectureIndex) => {
    e.stopPropagation(); // Stop parent module container from intercepting the drop
    if (!dragItem || dragItem.type !== "lesson") return;

    const updated = [...localSections];

    // Remove from source module (Fixed: .lessons -> .lectures)
    const sourceLectures = [...(updated[dragItem.moduleIndex].lectures || [])];
    const [movedLecture] = sourceLectures.splice(dragItem.lessonIndex, 1);
    updated[dragItem.moduleIndex].lectures = sourceLectures;

    // Add to target module (Fixed: .lessons -> .lectures)
    const targetLectures = [...(updated[targetModuleIndex].lectures || [])];
    targetLectures.splice(targetLectureIndex, 0, movedLecture);
    updated[targetModuleIndex].lectures = targetLectures;

    setLocalSections(updated);
    setDragItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border w-full max-w-md p-5">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Reorder Course Sections
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {reorderMode ? "Drag and drop enabled" : "Items are locked"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReorderMode((v) => !v)}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition ${
                reorderMode
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {reorderMode ? "Unlocked" : "Locked"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Items Container */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {localSections.map((module, moduleIdx) => (
            <div
              key={module.id || `module-${moduleIdx}`}
              draggable={reorderMode}
              onDragStart={() => handleDragStart("module", moduleIdx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDropModule(moduleIdx)}
              className={`border rounded-lg bg-gray-50 overflow-hidden transition-all ${
                reorderMode ? "border-dashed hover:border-blue-400" : ""
              }`}
            >
              {/* Module Row */}
              <div className="flex justify-between items-center p-3 bg-white border-b select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical
                    size={14}
                    className={`text-gray-400 ${reorderMode ? "cursor-grab active:cursor-grabbing" : "opacity-30"}`}
                  />
                  <span className="font-bold text-xs text-gray-800 truncate">
                    {module.title}
                  </span>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={moduleIdx === 0}
                    onClick={() => moveSection(moduleIdx, -1)}
                    className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-bold disabled:opacity-40 hover:bg-gray-50"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={moduleIdx === localSections.length - 1}
                    onClick={() => moveSection(moduleIdx, 1)}
                    className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-bold disabled:opacity-40 hover:bg-gray-50"
                  >
                    ▼
                  </button>
                </div>
              </div>

              {/* Nested Lectures Dropzone Area */}
              <div
                className="p-2 space-y-2 bg-gray-50 min-h-[40px]"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  // Fallback: Drop on empty area pushes to the end (Fixed: .lessons -> .lectures)
                  if (dragItem && dragItem.type === "lesson") {
                    handleDropLesson(
                      e,
                      moduleIdx,
                      (module.lectures || []).length,
                    );
                  }
                }}
              >
                {/* FIXED: Swapped module.lessons to module.lectures */}
                {module.lectures?.map((lecture, lectureIdx) => (
                  <div
                    key={lecture.id || `lecture-${moduleIdx}-${lectureIdx}`}
                    draggable={reorderMode}
                    onDragStart={() =>
                      handleDragStart("lesson", moduleIdx, lectureIdx)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropLesson(e, moduleIdx, lectureIdx)}
                    className={`flex justify-between items-center pl-4 pr-2 py-2 bg-white rounded border select-none transition-all ${
                      reorderMode ? "hover:border-blue-300" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical
                        size={12}
                        className={`text-gray-400 ${reorderMode ? "cursor-grab active:cursor-grabbing" : "opacity-30"}`}
                      />
                      <span className="text-xs text-gray-700 truncate">
                        {lecture.title}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={lectureIdx === 0}
                        onClick={() => moveLesson(moduleIdx, lectureIdx, -1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[9px] font-bold disabled:opacity-40 hover:bg-gray-50"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={lectureIdx === module.lectures.length - 1}
                        onClick={() => moveLesson(moduleIdx, lectureIdx, 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[9px] font-bold disabled:opacity-40 hover:bg-gray-50"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}

                {/* FIXED: Adjusted condition checking */}
                {(!module.lectures || module.lectures.length === 0) && (
                  <div className="text-center py-2 text-[11px] text-gray-400 italic">
                    No lectures in this module
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t pt-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSubmit}
            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}