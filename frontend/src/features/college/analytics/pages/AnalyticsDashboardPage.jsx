import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart3, RefreshCw, Download } from "lucide-react";

import { useAnalyticsDashboard } from "../hooks/useAnalyticsDashboard";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { useAnalyticsReports } from "../hooks/useAnalyticsReports";

import { AnalyticsOverview } from "../components/overview/AnalyticsOverview";
import { PlacementTrendChart } from "../components/charts/PlacementTrendChart";
import { DepartmentAnalyticsChart } from "../components/charts/DepartmentAnalyticsChart";
import { CompanyAnalyticsChart } from "../components/charts/CompanyAnalyticsChart";
import { PackageDistributionChart } from "../components/charts/PackageDistributionChart";
import { HiringTrendChart } from "../components/charts/HiringTrendChart";
import { MonthlyAnalyticsChart } from "../components/charts/MonthlyAnalyticsChart";
import { StudentPerformanceChart } from "../components/charts/StudentPerformanceChart";

import { PlacementReport } from "../components/reports/PlacementReport";
import { CompanyReport } from "../components/reports/CompanyReport";
import { DepartmentReport } from "../components/reports/DepartmentReport";
import { StudentReport } from "../components/reports/StudentReport";

import { DateFilter } from "../components/filters/DateFilter";
import { DepartmentFilter } from "../components/filters/DepartmentFilter";
import { CompanyFilter } from "../components/filters/CompanyFilter";
import { BatchFilter } from "../components/filters/BatchFilter";
import { ReportFilter } from "../components/filters/ReportFilter";

import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorState } from "../components/common/ErrorState";

import {
  placementTrend,
  companyAnalytics,
  departmentAnalytics,
  packageDistribution,
  monthlyHiring,
  studentPerformance,
} from "../types/analyticsDummyData";

const TABS = ["Overview", "Charts", "Reports"];

const AnalyticsDashboardPage = () => {
  const { darkMode } = useOutletContext();
  const { dashboardData, placementData, companyData, departmentData, studentData, loading, error, refresh } = useAnalyticsDashboard();
  const { filters, updateFilterField } = useAnalyticsFilters();
  const { reportData, loading: reportLoading } = useAnalyticsReports(filters.reportType, filters);

  const [activeTab, setActiveTab] = useState("Overview");

  const handleExport = (format) => {
    alert(`Exporting analytics as ${format.toUpperCase()}...`);
  };

  if (loading) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${darkMode ? "bg-[#1A1A1A]" : "bg-slate-100"}`}>
        <LoadingSpinner darkMode={darkMode} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${darkMode ? "bg-[#1A1A1A]" : "bg-slate-100"}`}>
        <ErrorState message={error} darkMode={darkMode} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>Analytics Dashboard</h1>
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Monitor placement statistics, student analytics, and performance insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              darkMode ? "border-[#3D3D3D] text-gray-300 hover:bg-[#2D2D2D]" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl w-fit ${darkMode ? "bg-[#2D2D2D]" : "bg-gray-100"}`}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : darkMode
                ? "text-gray-400 hover:text-white hover:bg-[#3D3D3D]"
                : "text-gray-500 hover:text-[#2D3436] hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border ${darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"}`}>
        <BatchFilter darkMode={darkMode} value={filters.batch} onChange={(v) => updateFilterField("batch", v)} />
        <DepartmentFilter darkMode={darkMode} value={filters.department} onChange={(v) => updateFilterField("department", v)} />
        <CompanyFilter darkMode={darkMode} value={filters.company} onChange={(v) => updateFilterField("company", v)} />
        <ReportFilter darkMode={darkMode} value={filters.reportType} onChange={(v) => updateFilterField("reportType", v)} />
        <DateFilter darkMode={darkMode} value={filters.dateRange} onChange={(v) => updateFilterField("dateRange", v)} />
      </div>

      {/* Content */}
      {activeTab === "Overview" && (
        <AnalyticsOverview darkMode={darkMode} dashboardData={dashboardData} placementData={placementData} />
      )}

      {activeTab === "Charts" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlacementTrendChart data={placementTrend} darkMode={darkMode} />
            <CompanyAnalyticsChart data={companyAnalytics} darkMode={darkMode} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentAnalyticsChart data={departmentAnalytics} darkMode={darkMode} />
            <PackageDistributionChart data={packageDistribution} darkMode={darkMode} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HiringTrendChart data={monthlyHiring} darkMode={darkMode} />
            <MonthlyAnalyticsChart data={monthlyHiring} darkMode={darkMode} />
          </div>
          <StudentPerformanceChart data={studentPerformance} darkMode={darkMode} />
        </div>
      )}

      {activeTab === "Reports" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlacementReport darkMode={darkMode} data={placementData} loading={reportLoading} />
            <CompanyReport darkMode={darkMode} data={companyData} loading={reportLoading} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentReport darkMode={darkMode} data={departmentData} loading={reportLoading} />
            <StudentReport darkMode={darkMode} data={studentData} loading={reportLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboardPage;
