import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart3, RefreshCw, Download, FileText, LayoutDashboard, PieChart } from "lucide-react";

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
import { headingText, subtleText, cardClass } from "../utils/analyticsHelpers";

import {
  placementTrend,
  companyAnalytics,
  departmentAnalytics,
  packageDistribution,
  monthlyHiring,
  studentPerformance,
} from "../types/analyticsDummyData";

const TABS = [
  { id: "Overview", icon: LayoutDashboard, label: "Overview" },
  { id: "Charts", icon: PieChart, label: "Charts" },
  { id: "Reports", icon: FileText, label: "Reports" },
];

const AnalyticsDashboardPage = () => {
  const { darkMode } = useOutletContext();
  const { filters, updateFilterField } = useAnalyticsFilters();
  const { 
    dashboardData, 
    placementData, 
    placementTrendsData, 
    companyData, 
    departmentData, 
    studentData, 
    loading, 
    error, 
    refresh 
  } = useAnalyticsDashboard(filters);
  const { loading: reportLoading, executeExport, exporting } = useAnalyticsReports(filters.reportType, filters);

  const [activeTab, setActiveTab] = useState("Overview");

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
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b ${
        darkMode ? "border-[#3D3D3D]" : "border-gray-200"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#ff6d34] to-[#ff8f66] shadow-lg shadow-orange-500/20`}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${headingText(darkMode)}`}>
              Analytics Dashboard
            </h1>
            <p className={`text-sm mt-0.5 ${subtleText(darkMode)}`}>
              Monitor placement statistics, student analytics, and performance insights.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
              darkMode
                ? "border-[#3D3D3D] text-gray-300 hover:bg-[#3D3D3D]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => executeExport("pdf")}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#ff6d34] to-[#ff8f66] text-white hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1.5 rounded-2xl w-fit ${darkMode ? "bg-[#2D2D2D]" : "bg-gray-100"}`}>
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
              activeTab === id
                ? darkMode
                  ? "bg-[#00bea3] text-white shadow-lg shadow-teal-500/20"
                  : "bg-[#00bea3] text-white shadow-lg shadow-teal-500/25"
                : darkMode
                ? "text-gray-400 hover:text-white hover:bg-[#3D3D3D]"
                : "text-gray-500 hover:text-[#2D3436] hover:bg-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={cardClass(darkMode)}>
        <div className="flex flex-wrap items-center gap-3">
          <BatchFilter darkMode={darkMode} value={filters.batch} onChange={(v) => updateFilterField("batch", v)} />
          <DepartmentFilter darkMode={darkMode} value={filters.department} onChange={(v) => updateFilterField("department", v)} />
          <CompanyFilter darkMode={darkMode} value={filters.company} onChange={(v) => updateFilterField("company", v)} />
          <ReportFilter darkMode={darkMode} value={filters.reportType} onChange={(v) => updateFilterField("reportType", v)} />
          <DateFilter darkMode={darkMode} value={filters.dateRange} onChange={(v) => updateFilterField("dateRange", v)} />
        </div>
      </div>

      {/* Content */}
      {activeTab === "Overview" && (
        <AnalyticsOverview darkMode={darkMode} dashboardData={dashboardData} placementData={placementData} />
      )}

      {activeTab === "Charts" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlacementTrendChart data={placementTrendsData.length > 0 ? placementTrendsData : placementData} darkMode={darkMode} />
            <CompanyAnalyticsChart data={companyData} darkMode={darkMode} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentAnalyticsChart data={departmentData} darkMode={darkMode} />
            <PackageDistributionChart data={dashboardData?.packageDistribution || []} darkMode={darkMode} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HiringTrendChart data={dashboardData?.monthlyHiring || []} darkMode={darkMode} />
            <MonthlyAnalyticsChart data={dashboardData?.monthlyHiring || []} darkMode={darkMode} />
          </div>
          <StudentPerformanceChart data={studentData?.studentPerformance || []} darkMode={darkMode} />
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
