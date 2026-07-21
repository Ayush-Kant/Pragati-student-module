// LessonList.jsx
// Sidebar-style list of lessons grouped by module

import LessonCard from "./LessonCard";
import EmptyState from "../common/EmptyState";
import { EMPTY_MESSAGES } from "../../constants/trainingLearningConstants";

const LessonList = ({ modules = [], activeLessonId, onSelectLesson }) => {
  if (!modules.length) {
    return <EmptyState title="No lessons yet" message={EMPTY_MESSAGES.LESSONS} icon="📚" />;
  }

  return (
    <div className="flex flex-col gap-5">
      {modules.map((mod) => (
        <div key={mod.moduleTitle}>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
            {mod.moduleTitle}
          </h4>
          <div className="flex flex-col gap-1">
            {mod.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                active={lesson.id === activeLessonId}
                onSelect={(l) => onSelectLesson?.(l.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonList;
