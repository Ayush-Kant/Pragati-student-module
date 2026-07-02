import KPIGrid from "../components/analytics/KPIGrid";
import SubmissionVelocityChart from "../components/analytics/SubmissionVelocityChart";
import AIInsightCards from "../components/analytics/AIInsightCards";
import TeamComparisonTable from "../components/analytics/TeamComparisonTable";
import PerformanceRadar from "../components/analytics/PerformanceRadar";
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import useAnalytics from "../hooks/useAnalytics";

export default function AnalyticsDashboardPage() {
    const analytics = useAnalytics();

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500">
        Loading analytics...
      </div>
    );
  }
  return (
    <div className="bg-slate-50">

      {/* Page Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-900">
          Project Analytics
        </h1>

        <p className="mt-2 text-slate-500">
          Understand project performance and assessment quality.
        </p>

        <AnalyticsFilters />

      </div>

      {/* KPI Cards */}
      <section className="mb-6">
        <KPIGrid data={analytics.kpis} />
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">

        <div className="xl:col-span-8 h-[380px]">
          <SubmissionVelocityChart data={analytics.velocity} />
        </div>

        <div className="xl:col-span-4 h-[380px]">
          <AIInsightCards data={analytics.insights} />
        </div>

      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <div className="xl:col-span-8">
          <TeamComparisonTable data={analytics.teams} />
        </div>

        <div className="xl:col-span-4">
          <PerformanceRadar />
        </div>

      </section>

    </div>
  );
}