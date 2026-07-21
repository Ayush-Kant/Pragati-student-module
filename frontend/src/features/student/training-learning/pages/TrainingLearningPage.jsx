// TrainingLearningPage.jsx
// Entry page for the Training & Learning module (SM-04 / MOD-4).
// Pages -> Components -> Hooks -> Services -> Backend APIs
//
// RESERVED FILE — only the Team Lead / module owner should modify this file.

import { useState } from "react";

import useTrainingCourses from "../hooks/useTrainingCourses";
import useCourseProgress from "../hooks/useCourseProgress";
import useLearningResources from "../hooks/useLearningResources";
import useLessonPlayer from "../hooks/useLessonPlayer";

import SectionHeader from "../components/common/SectionHeader";
import SearchCourse from "../components/filters/SearchCourse";
import CategoryFilter from "../components/filters/CategoryFilter";
import LevelFilter from "../components/filters/LevelFilter";
import StatusFilter from "../components/filters/StatusFilter";

import ContinueLearning from "../components/courses/ContinueLearning";
import CourseGrid from "../components/courses/CourseGrid";
import CourseDetails from "../components/courses/CourseDetails";

import LessonList from "../components/lessons/LessonList";
import LessonPlayer from "../components/lessons/LessonPlayer";

import LearningResources from "../components/resources/LearningResources";
import ProgressTracker from "../components/progress/ProgressTracker";
import LearningStatistics from "../components/progress/LearningStatistics";

import { learningStatistics } from "../types/trainingLearningDummyData";

const TABS = ["Lessons", "Resources", "Progress"];

const TrainingLearningPage = () => {
  const {
    courses,
    continueLearningCourses,
    search,
    setSearch,
    category,
    setCategory,
    level,
    setLevel,
    status,
    setStatus,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useTrainingCourses();

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeTab, setActiveTab] = useState("Lessons");

  const { course, progress, loading: progressLoading, error: progressError, refetch: refetchProgress } =
    useCourseProgress(selectedCourseId);

  const { resources, loading: resourcesLoading, error: resourcesError, refetch: refetchResources } =
    useLearningResources(selectedCourseId);

  const {
    modules,
    activeLesson,
    activeLessonId,
    selectLesson,
    markLessonComplete,
    goToNextLesson,
    lessons,
  } = useLessonPlayer(selectedCourseId);

  const handleSelectCourse = (courseItem) => {
    setSelectedCourseId(courseItem.id);
    setActiveTab("Lessons");
  };

  const handleBackToCourses = () => setSelectedCourseId(null);

  const hasNextLesson =
    lessons.length > 0 && lessons.findIndex((l) => l.id === activeLessonId) < lessons.length - 1;

  // ── Course detail view ─────────────────────────────
  if (selectedCourseId) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <button
          onClick={handleBackToCourses}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Back to Courses
        </button>

        <CourseDetails course={course} activeTab={activeTab} onTabChange={setActiveTab} tabs={TABS}>
          {activeTab === "Lessons" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <LessonPlayer
                  lesson={activeLesson}
                  onMarkComplete={markLessonComplete}
                  onNext={goToNextLesson}
                  hasNext={hasNextLesson}
                />
              </div>
              <div className="order-1 lg:order-2">
                <LessonList modules={modules} activeLessonId={activeLessonId} onSelectLesson={selectLesson} />
              </div>
            </div>
          )}

          {activeTab === "Resources" && (
            <div className="mt-4">
              <LearningResources
                resources={resources}
                loading={resourcesLoading}
                error={resourcesError}
                onRetry={refetchResources}
              />
            </div>
          )}

          {activeTab === "Progress" && (
            <div className="mt-4">
              <ProgressTracker
                course={course}
                progress={progress}
                loading={progressLoading}
                error={progressError}
                onRetry={refetchProgress}
              />
            </div>
          )}
        </CourseDetails>
      </div>
    );
  }

  // ── Course listing view ─────────────────────────────
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Training & Learning</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse your training programs, continue learning, and track your progress.
        </p>
      </div>

      <LearningStatistics statistics={learningStatistics} loading={false} />

      <div>
        <SectionHeader title="Continue Learning" subtitle="Pick up where you left off" />
        <ContinueLearning courses={continueLearningCourses} onResume={handleSelectCourse} />
      </div>

      <div>
        <SectionHeader
          title="All Courses"
          subtitle="Browse the full training catalogue"
          action={
            <div className="flex flex-wrap gap-2">
              <SearchCourse value={search} onChange={setSearch} />
              <CategoryFilter value={category} onChange={setCategory} />
              <LevelFilter value={level} onChange={setLevel} />
              <StatusFilter value={status} onChange={setStatus} />
            </div>
          }
        />
        <CourseGrid
          courses={courses}
          loading={coursesLoading}
          error={coursesError}
          onRetry={refetchCourses}
          onSelectCourse={handleSelectCourse}
        />
      </div>
    </div>
  );
};

export default TrainingLearningPage;
