import usePerformance from "../hooks/usePerformance";

import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import PerformanceOverview from "../components/PerformanceOverview";

const PerformancePage = () => {
  const { performance, loading, error } =
    usePerformance();

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorState message={error} />;

  if (!performance) return <EmptyState />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Performance Analytics
          </h1>

          <p className="mt-2 text-gray-500">
            Track your learning progress, statistics,
            achievements and performance.
          </p>
        </div>

        <PerformanceOverview
          data={performance}
        />

      </div>
    </div>
  );
};

export default PerformancePage;