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

  // Reorder lessons inside a module via buttons
  const moveLesson = (moduleIdx, lessonIdx, direction) => {
    const nextIndex = lessonIdx + direction;
    const moduleLessons = localSections[moduleIdx].lessons || [];
    if (nextIndex < 0 || nextIndex >= moduleLessons.length) return;

    const updated = [...localSections];
    const updatedLessons = [...moduleLessons];
    const [removed] = updatedLessons.splice(lessonIdx, 1);
    updatedLessons.splice(nextIndex, 0, removed);

    updated[moduleIdx].lessons = updatedLessons;
    setLocalSections(updated);
  };

  const handleSaveSubmit = () => {
    onSave(localSections);
    onClose();
  };

  // --- HTML5 Drag & Drop Logic ---
  const handleDragStart = (type, moduleIndex, lessonIndex = null) => {
    if (!reorderMode) return;
    setDragItem({ type, moduleIndex, lessonIndex });
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

  const handleDropLesson = (e, targetModuleIndex, targetLessonIndex) => {
    e.stopPropagation(); // Stop parent module container from intercepting the drop
    if (!dragItem || dragItem.type !== "lesson") return;

    const updated = [...localSections];

    // Remove from source module
    const sourceLessons = [...updated[dragItem.moduleIndex].lessons];
    const [movedLesson] = sourceLessons.splice(dragItem.lessonIndex, 1);
    updated[dragItem.moduleIndex].lessons = sourceLessons;

    // Add to target module
    const targetLessons = [...(updated[targetModuleIndex].lessons || [])];
    targetLessons.splice(targetLessonIndex, 0, movedLesson);
    updated[targetModuleIndex].lessons = targetLessons;

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

              {/* Nested Lessons Dropzone Area */}
              <div
                className="p-2 space-y-2 bg-gray-50 min-h-[40px]"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  // Fallback: If dropped on the empty area of the module's lesson block, push to the end
                  if (dragItem && dragItem.type === "lesson") {
                    handleDropLesson(
                      e,
                      moduleIdx,
                      (module.lessons || []).length,
                    );
                  }
                }}
              >
                {module.lessons?.map((lesson, lessonIdx) => (
                  <div
                    key={lesson.id || `lesson-${moduleIdx}-${lessonIdx}`}
                    draggable={reorderMode}
                    onDragStart={() =>
                      handleDragStart("lesson", moduleIdx, lessonIdx)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropLesson(e, moduleIdx, lessonIdx)}
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
                        {lesson.title}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={lessonIdx === 0}
                        onClick={() => moveLesson(moduleIdx, lessonIdx, -1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[9px] font-bold disabled:opacity-40 hover:bg-gray-50"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={lessonIdx === module.lessons.length - 1}
                        onClick={() => moveLesson(moduleIdx, lessonIdx, 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[9px] font-bold disabled:opacity-40 hover:bg-gray-50"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}

                {(!module.lessons || module.lessons.length === 0) && (
                  <div className="text-center py-2 text-[11px] text-gray-400 italic">
                    No lessons in this module
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
