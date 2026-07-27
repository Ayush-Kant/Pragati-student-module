import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, GraduationCap, ListChecks } from "lucide-react";
import LessonCard from "./LessonCard";
import ProgressBar from "./ProgressBar";
import { getModuleById, updateLearningProgress } from "../services/learningModuleService";
import { formatDuration, formatDate } from "../utils/learningHelpers";

/**
 * ModuleDetails component displaying full module information and lessons.
 *
 * @param {object} props
 * @param {string} props.moduleId - The module id to display.
 * @param {function} [props.onBack] - Callback when back button is clicked.
 * @returns {JSX.Element}
 */
const ModuleDetails = ({ moduleId, onBack }) => {
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
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-6 transition cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Modules
      </button>

      {/* Module header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {module.level}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {module.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{module.title}</h1>
        <p className="text-slate-600 mb-6">{module.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <GraduationCap size={16} className="text-blue-500" />
            <span>{module.lessons?.length || 0} Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={16} className="text-blue-500" />
            <span>{formatDuration(module.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ListChecks size={16} className="text-blue-500" />
            <span>{module.progress}% Complete</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={16} className="text-slate-400" />
            <span>Last accessed {formatDate(module.lastAccessed)}</span>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={module.progress} label="Overall Progress" showPercentage />
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Lessons</h2>
        {module.lessons?.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            moduleId={module.id}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleDetails;
