import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, GraduationCap, ListChecks } from "lucide-react";
import LessonCard from "./LessonCard";
import ProgressBar from "./ProgressBar";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import { getModuleById, updateLearningProgress } from "../services/learningModuleService";
import { formatDuration, formatDate } from "../utils/learningHelpers";

/**
 * ModuleDetails component displaying full module information and lessons.
 *
 * @param {object} props
 * @param {string} props.moduleId - The module id to display.
 * @param {function} [props.onBack] - Callback when back button is clicked.
 * @param {function} [props.onProgressUpdate] - Callback when progress is updated.
 * @returns {JSX.Element}
 */
const ModuleDetails = ({ moduleId, onBack, onProgressUpdate }) => {
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getModuleById(moduleId)
      .then((result) => {
        if (isMounted) {
          if (result.success) {
            setModule(result.data);
          } else {
            setError(result.error);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load module details");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [moduleId]);

  const handleToggleComplete = async (modId, lessonId, completed) => {
    const result = await updateLearningProgress(modId, lessonId, completed);
    if (result.success) {
      setModule(result.data);
      
      // ✅ Pass the updated module back to parent
      if (onProgressUpdate) {
        onProgressUpdate(result.data);
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/student/learning-modules");
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  if (!module) {
    return <EmptyState title="Module not found" description="The requested module could not be loaded." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 scroll-smooth scrollbar-thin">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 mb-6 transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Modules
      </button>

      {/* Module header */}
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-2xl shadow-orange-500/5 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10">
            {module.level}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10">
            {module.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">{module.title}</h1>
        <p className="text-gray-300 mb-6">{module.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <GraduationCap size={16} className="text-teal-400" />
            <span>{module.lessons?.length || 0} Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={16} className="text-teal-400" />
            <span>{formatDuration(module.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <ListChecks size={16} className="text-teal-400" />
            <span>{module.progress}% Complete</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={16} className="text-gray-500" />
            <span>Last accessed {formatDate(module.lastAccessed)}</span>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={module.progress} label="Overall Progress" showPercentage />
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-orange-300 via-orange-400 to-teal-400 bg-clip-text text-transparent mb-3 animate-fade-in drop-shadow-[0_0_8px_rgba(251,146,60,0.25)]">
          Lessons
        </h2>
        {module.lessons?.map((lesson, index) => (
          <div
            key={lesson.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <LessonCard
              lesson={lesson}
              moduleId={module.id}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleDetails;