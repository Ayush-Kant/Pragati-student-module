import { useMemo, useState } from "react";
import { useLearningModules } from "../hooks/useLearningModules";
import ModuleCard from "../components/ModuleCard";
import ModuleDetails from "../components/ModuleDetails";
import ModuleFilter from "../components/ModuleFilter";
import ContinueLearning from "../components/ContinueLearning";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import {
  searchModules,
  filterModulesByCategory,
  sortModules,
} from "../utils/learningHelpers";
import { MODULE_CATEGORIES } from "../constants/learningConstants";

/**
 * Main page for learning modules.
 * Displays continue learning section, filters, and a responsive grid of modules.
 */
const LearningModulesPage = () => {
  const { modules, isLoading, error, refetch } = useLearningModules();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatedModules, setUpdatedModules] = useState([]);

  // ✅ FIX: Only show modules with progress between 1-99% (in progress)
  const continueModule = useMemo(() => {
    const sourceModules = updatedModules.length > 0 ? updatedModules : modules;
    return sourceModules.find((m) => m.progress > 0 && m.progress < 100) || null;
  }, [modules, updatedModules]);

  // ✅ Check if user has any progress
  const hasProgress = useMemo(() => {
    const sourceModules = updatedModules.length > 0 ? updatedModules : modules;
    return sourceModules.some(m => m.progress > 0);
  }, [modules, updatedModules]);

  // ✅ Get first module for "Start Learning" suggestion
  const firstModule = useMemo(() => {
    const sourceModules = updatedModules.length > 0 ? updatedModules : modules;
    return sourceModules.length > 0 ? sourceModules[0] : null;
  }, [modules, updatedModules]);

  const handleModuleProgressUpdate = (updatedModule) => {
    setUpdatedModules(prev => {
      const source = prev.length > 0 ? prev : modules;
      return source.map(m => 
        m.id === updatedModule.id ? updatedModule : m
      );
    });
  };

  const displayedModules = useMemo(() => {
    const sourceModules = updatedModules.length > 0 ? updatedModules : modules;
    let result = [...sourceModules];

    if (searchQuery.trim()) {
      result = searchModules(result, searchQuery);
    }

    if (categoryFilter && categoryFilter !== "All") {
      result = filterModulesByCategory(result, categoryFilter);
    }

    return sortModules(result, sortBy);
  }, [modules, updatedModules, searchQuery, categoryFilter, sortBy]);

  const handleModuleClick = (module) => {
    setSelectedModuleId(module.id);
    setShowDetails(true);
  };

  const handleBackToGrid = () => {
    setShowDetails(false);
    setSelectedModuleId(null);
  };

  const handleFilterChange = ({ category, query }) => {
    setCategoryFilter(category || "All");
    setSearchQuery(query || "");
  };

  if (showDetails && selectedModuleId) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 bg-[#050505] text-gray-100 scroll-smooth">
        <ModuleDetails 
          moduleId={selectedModuleId} 
          onBack={handleBackToGrid}
          onProgressUpdate={handleModuleProgressUpdate}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-[#050505] text-gray-100 scroll-smooth min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-2 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]">
          Learning Modules
        </h1>
        <p className="text-gray-400">
          Explore courses designed to build your technical skills.
        </p>
      </div>

      {/* Continue Learning - Only show if user has progress between 1-99% */}
      {continueModule && (
        <section className="mb-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            Continue Learning
          </h2>
          <ContinueLearning
            module={continueModule}
            onResume={() => handleModuleClick(continueModule)}
          />
        </section>
      )}

      {/* Show "Start Learning" for new users (no progress yet) */}
      {!hasProgress && firstModule && (
        <section className="mb-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            🚀 Start Your Learning Journey
          </h2>
          <div className="bg-gradient-to-r from-orange-500/15 via-gray-800/50 to-teal-500/15 border border-orange-500/20 rounded-xl p-6 shadow-2xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-shadow duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {firstModule.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {firstModule.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span>📚 {firstModule.lessons?.length || 0} lessons</span>
                  <span>⏱ {firstModule.duration} min</span>
                  <span className="text-orange-400 font-medium">Ready to begin!</span>
                </div>
              </div>
              <button
                onClick={() => handleModuleClick(firstModule)}
                className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
              >
                🚀 Start Learning
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="mb-6 animate-slide-up">
        <ModuleFilter
          categories={Object.values(MODULE_CATEGORIES)}
          onFilterChange={handleFilterChange}
        />
      </section>

      {/* Sort */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3 animate-slide-up">
        <p className="text-sm text-gray-400">
          {displayedModules.length}{" "}
          {displayedModules.length === 1 ? "module" : "modules"} found
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-300">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-2 focus:ring-offset-[#050505] bg-[#0a0a0a] text-gray-200 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
          >
            <option value="date">Last Accessed</option>
            <option value="title">Title (A-Z)</option>
            <option value="progress">Progress</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Content states */}
      {isLoading && <LoadingSpinner size="lg" />}

      {!isLoading && error && (
        <ErrorState error={error} onRetry={refetch} />
      )}

      {!isLoading && !error && displayedModules.length === 0 && (
        <EmptyState
          title="No modules found"
          description="Try adjusting your search or filter criteria."
          icon="📚"
        />
      )}

      {/* Module grid */}
      {!isLoading && !error && displayedModules.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 scrollbar-thin">
          {displayedModules.map((module, index) => (
            <div
              key={module.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ModuleCard
                module={module}
                onClick={handleModuleClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningModulesPage;