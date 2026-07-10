// LearningStatistics.jsx
// Grid of overall learning stats (courses, lessons, hours, streak)

import ProgressCard from "./ProgressCard";
import LoadingSpinner from "../common/LoadingSpinner";

const LearningStatistics = ({ statistics, loading }) => {
  if (loading) return <LoadingSpinner label="Loading statistics..." />;
  if (!statistics) return null;

  const cards = [
    { icon: "🎓", label: "Courses Enrolled", value: statistics.totalCoursesEnrolled, accent: "text-blue-600" },
    { icon: "✅", label: "Courses Completed", value: statistics.coursesCompleted, accent: "text-green-600" },
    { icon: "📈", label: "In Progress", value: statistics.coursesInProgress, accent: "text-yellow-600" },
    { icon: "📚", label: "Lessons Completed", value: statistics.totalLessonsCompleted, accent: "text-purple-600" },
    { icon: "⏱️", label: "Hours Learned", value: statistics.totalHoursLearned, accent: "text-indigo-600" },
    { icon: "🔥", label: "Day Streak", value: statistics.currentStreakDays, accent: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <ProgressCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default LearningStatistics;
