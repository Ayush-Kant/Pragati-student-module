import React, { useState } from "react";
import {
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";

export default function LectureRow({
  lecture,
  sectionId,
  modules,
  onUpdateModules,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(lecture.title || "");

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const updated = modules.map((m) => {
      if (m.id === sectionId) {
        return {
          ...m,
          lectures: m.lectures.map((l) =>
            l.id === lecture.id ? { ...l, title: titleInput } : l,
          ),
        };
      }
      return m;
    });
    onUpdateModules(updated);
  };

  // Resolve core indicator display icons contextually
  const getIcon = (type) => {
    switch (type) {
      case "Video":
        return <Video size={14} className="text-blue-500" />;
      case "Article":
        return <FileText size={14} className="text-emerald-500" />;
      case "Quiz":
        return <HelpCircle size={14} className="text-purple-500" />;
      default:
        return <FileText size={14} className="text-gray-500" />;
    }
  };

  const handleDeleteLecture = () => {
    const updated = modules.map((m) => {
      if (m.id === sectionId) {
        return {
          ...m,
          lectures: m.lectures.filter((l) => l.id !== lecture.id),
        };
      }
      return m;
    });
    onUpdateModules(updated);
  };

  return (
    <div className="flex justify-between items-center p-2.5 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <GripVertical
          className="text-gray-300 cursor-move shrink-0"
          size={16}
        />
        <div className="shrink-0">{getIcon(lecture.type)}</div>
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            className="px-2 py-0.5 text-sm font-semibold border rounded outline-none focus:ring-1 focus:ring-blue-500 flex-1 max-w-md"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            className="font-semibold text-sm text-gray-800 truncate cursor-pointer hover:text-blue-600"
          >
            {lecture.title}
          </span>
        )}
        <span
          className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
            lecture.status === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {lecture.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-gray-400 ml-2 shrink-0">
        <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-bold">
          {lecture.type}
        </span>
        {lecture.type === "Video" && (
          <span className="text-gray-500 font-semibold">
            {lecture.duration}
          </span>
        )}
        <div className="relative group">
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
            <MoreHorizontal size={14} />
          </button>
          {/* Simple Dropdown Menu context panel frame injection positioning */}
          <div className="absolute right-0 top-full hidden group-hover:block bg-white border rounded shadow-md py-1 z-10 w-24">
            <button
              onClick={handleDeleteLecture}
              className="w-full text-left px-2 py-1 text-red-600 hover:bg-gray-50 text-[11px] font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
