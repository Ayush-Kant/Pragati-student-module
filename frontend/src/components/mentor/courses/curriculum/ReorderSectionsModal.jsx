import React, { useState, useEffect } from "react";
import { GripVertical, X } from "lucide-react";
import { useModules } from "../../../../hooks/useModules.js";

export default function ReorderSectionsModal({
  modules,
  courseId,
  onClose,
  onSave,
}) {
  const [localSections, setLocalSections] = useState([]);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragItem, setDragItem] = useState(null);

  // Instantiating hook context safely
  const { handleReorderModules, handleReorderLessons, moduleLoading } =
    useModules();

  useEffect(() => {
    if (modules) {
      setLocalSections(JSON.parse(JSON.stringify(modules)));
    }
  }, [modules]);

  const moveSection = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= localSections.length) return;
    const reordered = [...localSections];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, removed);
    setLocalSections(reordered);
  };

  const moveLesson = (moduleIdx, lectureIdx, direction) => {
    const nextIndex = lectureIdx + direction;
    const moduleLectures = localSections[moduleIdx].lectures || [];
    if (nextIndex < 0 || nextIndex >= moduleLectures.length) return;

    const updated = [...localSections];
    const updatedLectures = [...moduleLectures];
    const [removed] = updatedLectures.splice(lectureIdx, 1);
    updatedLectures.splice(nextIndex, 0, removed);

    updated[moduleIdx].lectures = updatedLectures;
    setLocalSections(updated);
  };

  // Fixed Save routine handling both modules sequencing and inner items sequencings sequential processing
  const handleSaveSubmit = async () => {
    try {
      // 1. Fire Module Reorder API
      const modulePayload = localSections.map((mod, index) => ({
        id: mod.id,
        orderIndex: index,
      }));
      await handleReorderModules(courseId, modulePayload);

      // 2. Fire Lessons Reorder APIs for every section sequentially
      for (const section of localSections) {
        if (section.lectures && section.lectures.length > 0) {
          const lessonPayload = section.lectures.map((lec, index) => ({
            lessonId: lec.id,
            orderIndex: index,
          }));
          await handleReorderLessons(section.id, lessonPayload);
        }
      }

      onSave(localSections);
      onClose();
    } catch (err) {
      console.error("Backend sequencing save failed: ", err);
    }
  };

  const handleDragStart = (type, moduleIndex, lectureIndex = null) => {
    if (!reorderMode) return;
    setDragItem({ type, moduleIndex, lessonIndex: lectureIndex });
  };

  const handleDragOver = (e) => e.preventDefault();

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
    e.stopPropagation();
    if (!dragItem || dragItem.type !== "lesson") return;

    const updated = [...localSections];

    const sourceLectures = [...(updated[dragItem.moduleIndex].lectures || [])];
    const [movedLecture] = sourceLectures.splice(dragItem.lessonIndex, 1);
    updated[dragItem.moduleIndex].lectures = sourceLectures;

    const targetLectures = [...(updated[targetModuleIndex].lectures || [])];
    targetLectures.splice(targetLectureIndex, 0, movedLecture);
    updated[targetModuleIndex].lectures = targetLectures;

    setLocalSections(updated);
    setDragItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border w-full max-w-md p-5">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Reorder Course Sections
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {reorderMode ? "Drag and drop enabled" : "Items locked"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReorderMode(!reorderMode)}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition ${reorderMode ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
            >
              {reorderMode ? "Unlocked" : "Locked"}
            </button>
            <button type="button" onClick={onClose} className="text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {localSections.map((module, moduleIdx) => (
            <div
              key={module.id || `module-${moduleIdx}`}
              draggable={reorderMode}
              onDragStart={() => handleDragStart("module", moduleIdx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDropModule(moduleIdx)}
              className={`border rounded-lg bg-gray-50 overflow-hidden transition-all ${reorderMode ? "border-dashed hover:border-blue-400" : ""}`}
            >
              <div className="flex justify-between items-center p-3 bg-white border-b select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical
                    size={14}
                    className={`text-gray-400 ${reorderMode ? "cursor-grab" : "opacity-30"}`}
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
                    className="px-1.5 py-0.5 bg-white border rounded text-[10px] disabled:opacity-40"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={moduleIdx === localSections.length - 1}
                    onClick={() => moveSection(moduleIdx, 1)}
                    className="px-1.5 py-0.5 bg-white border rounded text-[10px] disabled:opacity-40"
                  >
                    ▼
                  </button>
                </div>
              </div>

              <div
                className="p-2 space-y-2 bg-gray-50 min-h-[40px]"
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  dragItem?.type === "lesson" &&
                  handleDropLesson(e, moduleIdx, (module.lectures || []).length)
                }
              >
                {module.lectures?.map((lecture, lectureIdx) => (
                  <div
                    key={lecture.id || `lecture-${moduleIdx}-${lectureIdx}`}
                    draggable={reorderMode}
                    onDragStart={() =>
                      handleDragStart("lesson", moduleIdx, lectureIdx)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropLesson(e, moduleIdx, lectureIdx)}
                    className={`flex justify-between items-center pl-4 pr-2 py-2 bg-white rounded border select-none ${reorderMode ? "hover:border-blue-300" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-700 truncate">
                        {lecture.title}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={lectureIdx === 0}
                        onClick={() => moveLesson(moduleIdx, lectureIdx, -1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[9px] disabled:opacity-40"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={lectureIdx === module.lectures.length - 1}
                        onClick={() => moveLesson(moduleIdx, lectureIdx, 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[9px] disabled:opacity-40"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t pt-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSubmit}
            disabled={moduleLoading}
            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg disabled:opacity-40"
          >
            {moduleLoading ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
