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

  const continueModule = useMemo(() => {
    return modules.find((m) => m.progress > 0) || null;
  }, [modules]);

  const displayedModules = useMemo(() => {
    let result = [...modules];

    if (searchQuery.trim()) {
      result = searchModules(result, searchQuery);
    }

    if (categoryFilter && categoryFilter !== "All") {
      result = filterModulesByCategory(result, categoryFilter);
    }

    return sortModules(result, sortBy);
  }, [modules, searchQuery, categoryFilter, sortBy]);

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
      <div className="max-w-5xl mx-auto px-4 py-6">
        <ModuleDetails moduleId={selectedModuleId} onBack={handleBackToGrid} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Modules</h1>
        <p className="text-slate-500">
          Explore courses designed to build your technical skills.
        </p>
      </div>

      {/* Continue Learning */}
      {continueModule && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Continue Learning
          </h2>
          <ContinueLearning
            module={continueModule}
            onResume={() => handleModuleClick(continueModule)}
          />
        </section>
      )}

      {/* Filters */}
      <section className="mb-6">
        <ModuleFilter
          categories={Object.values(MODULE_CATEGORIES)}
          onFilterChange={handleFilterChange}
        />
      </section>

      {/* Sort */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="text-sm text-slate-500">
          {displayedModules.length}{" "}
          {displayedModules.length === 1 ? "module" : "modules"} found
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={handleModuleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningModulesPage;
