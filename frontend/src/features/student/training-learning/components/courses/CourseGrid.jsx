// CourseGrid.jsx
// Responsive grid of CourseCards with loading/error/empty states

import CourseCard from "./CourseCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import { EMPTY_MESSAGES } from "../../constants/trainingLearningConstants";

const CourseGrid = ({ courses, loading, error, onRetry, onSelectCourse }) => {
  if (loading) return <LoadingSpinner label="Loading courses..." />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!courses?.length) return <EmptyState title="No courses found" message={EMPTY_MESSAGES.COURSES} icon="🎓" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onView={onSelectCourse} />
      ))}
    </div>
  );
};

export default CourseGrid;
