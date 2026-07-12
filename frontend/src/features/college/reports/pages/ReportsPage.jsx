import React, { useState } from "react";
import { Plus, SlidersHorizontal, RefreshCw, Grid, List, Sparkles, X, Check } from "lucide-react";

// Hooks
import useReports from "../hooks/useReports";
import useReportFilters from "../hooks/useReportFilters";
import useExportReports from "../hooks/useExportReports";

// Validations & Constants
import { validateReport } from "../validations/reportsValidation";
import { REPORT_TYPES, DEPARTMENTS, COMPANIES, BATCHES } from "../constants/reportsConstants";

// Components
import ReportsDashboard from "../components/dashboard/ReportsDashboard";
import ReportTable from "../components/reports/ReportTable";
import ReportCard from "../components/reports/ReportCard";
import ReportDetails from "../components/reports/ReportDetails";
import ReportPreview from "../components/reports/ReportPreview";

// Filters
import SearchReport from "../components/filters/SearchReport";
import ReportTypeFilter from "../components/filters/ReportTypeFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";
import CompanyFilter from "../components/filters/CompanyFilter";
import BatchFilter from "../components/filters/BatchFilter";
import DateRangeFilter from "../components/filters/DateRangeFilter";

// Common
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import ConfirmationModal from "../components/common/ConfirmationModal";

export const ReportsPage = () => {
  // Tab control: "dashboard" | "database"
  const [activeTab, setActiveTab] = useState("dashboard");
  // Layout control: "table" | "grid"
  const [layoutMode, setLayoutMode] = useState("table");
  // Toggle for filters drawer on mobile/tablet
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Modals state
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [previewingReport, setPreviewingReport] = useState(null);
  const [inspectingReport, setInspectingReport] = useState(null);
  const [deletingReportId, setDeletingReportId] = useState(null);
  
  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Form State for generating reports
  const initialFormState = {
    reportName: "",
    type: "Placement",
    department: "CSE",
    company: "Google",
    batch: "2026",
    startDate: "",
    endDate: "",
    description: "",
    generatedBy: "Placement Officer"
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Core Hooks integration
  const {
    reports,
    statistics,
    isLoading,
    isGenerating,
    error: reportsError,
    createReport,
    removeReport,
    fetchReports
  } = useReports();

  const {
    filters,
    errors: filterErrors,
    setFilter,
    resetFilters,
    filterReports
  } = useReportFilters();

  const triggerToast = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const {
    exportingId,
    exportPDF,
    exportExcel,
    exportCSV,
    downloadReportFile
  } = useExportReports(() => {
    triggerToast("Report file downloaded successfully.");
    fetchReports(); // Refresh download counts & statistics
  });

  // Filtered reports computed list
  const filteredReportsList = React.useMemo(() => {
    return filterReports(reports);
  }, [reports, filterReports]);

  // Form handlers
  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleGenerateReportSubmit = async (e) => {
    e.preventDefault();
    const validation = validateReport(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      triggerToast("Please check form errors.", "error");
      return;
    }

    const response = await createReport(formData);
    if (response.success) {
      setIsGenModalOpen(false);
      setFormData(initialFormState);
      setFormErrors({});
      triggerToast(`Successfully generated "${response.report.reportName}"!`);
      setActiveTab("database"); // Redirect to show generated list
    } else {
      triggerToast(response.error || "Failed to generate report", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReportId) return;
    const response = await removeReport(deletingReportId);
    if (response.success) {
      triggerToast("Report deleted successfully.");
      setDeletingReportId(null);
      if (inspectingReport?.id === deletingReportId) {
        setInspectingReport(null);
      }
    } else {
      triggerToast(response.error || "Failed to delete report.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header (No-Print) */}
      <header className="bg-brand-dark text-white shadow-md border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-white text-base shadow-lg shadow-orange-500/20">
              U
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight">UpToSkills</span>
                <span className="bg-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/20 uppercase tracking-widest">
                  AI-Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                PLACEMENT & TRAINING REPORTS GENERATOR
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setFormData(initialFormState);
                setIsGenModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition duration-150 shadow-md shadow-orange-500/10 active:scale-97 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700 flex items-center justify-center text-xs">
                AD
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Toast Notifications */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className={`flex items-center space-x-2.5 px-4.5 py-3 rounded-2xl shadow-xl border text-sm font-semibold ${
            notification.type === "success" 
              ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
              : "bg-red-50 border-red-100 text-red-800"
          }`}>
            <span className={`p-1 rounded-full text-white ${notification.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
              {notification.type === "success" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 3. Navigation Bar (No-Print) */}
      <nav className="bg-white border-b border-slate-200/80 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
          <div className="flex space-x-6 h-full">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`h-full px-1 border-b-2 flex items-center text-sm font-bold transition duration-150 cursor-pointer ${
                activeTab === "dashboard"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab("database")}
              className={`h-full px-1 border-b-2 flex items-center text-sm font-bold transition duration-150 cursor-pointer ${
                activeTab === "database"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Reports Database ({reports.length})
            </button>
          </div>

          <button
            onClick={() => {
              fetchReports();
              triggerToast("Synchronized with reports database.");
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 border border-slate-100 transition cursor-pointer"
            title="Refresh database cache"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 4. Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {reportsError && <ErrorState message={reportsError} onRetry={fetchReports} />}
        
        {isLoading ? (
          <div className="py-20"><LoadingSpinner message="Accessing secure database servers..." /></div>
        ) : (
          <>
            {/* TAB 1: DASHBOARD VIEW */}
            {activeTab === "dashboard" && (
              <ReportsDashboard
                reports={reports}
                statistics={statistics}
                onPreviewReport={(r) => setPreviewingReport(r)}
                onDownloadReport={(r) => downloadReportFile(r)}
                downloadingId={exportingId}
                onNavigateToReports={() => setActiveTab("database")}
              />
            )}

            {/* TAB 2: REPORTS DATABASE VIEW */}
            {activeTab === "database" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* A. Left Sidebar Filter Panel (Desktop View) (No-Print) */}
                <aside className="hidden lg:flex flex-col space-y-5 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm no-print">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      <span>Search & Filters</span>
                    </h4>
                    <button 
                      onClick={resetFilters}
                      className="text-[11px] font-bold text-slate-400 hover:text-primary transition cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <SearchReport 
                    value={filters.search} 
                    onChange={(val) => setFilter("search", val)} 
                  />
                  <DepartmentFilter 
                    value={filters.department} 
                    onChange={(val) => setFilter("department", val)} 
                  />
                  <CompanyFilter 
                    value={filters.company} 
                    onChange={(val) => setFilter("company", val)} 
                  />
                  <BatchFilter 
                    value={filters.batch} 
                    onChange={(val) => setFilter("batch", val)} 
                  />
                  <DateRangeFilter
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    onStartChange={(val) => setFilter("startDate", val)}
                    onEndChange={(val) => setFilter("endDate", val)}
                    error={filterErrors?.dateRange}
                  />
                </aside>

                {/* B. Mobile filters slide toggler */}
                <div className="lg:hidden flex items-center justify-between bg-white border border-slate-150 p-3 rounded-xl shadow-sm no-print">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
                  </button>
                  <button 
                    onClick={resetFilters}
                    className="text-xs font-bold text-slate-400 hover:text-primary transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Mobile filters expansion panel */}
                {showMobileFilters && (
                  <div className="lg:hidden flex flex-col space-y-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm no-print">
                    <SearchReport value={filters.search} onChange={(val) => setFilter("search", val)} />
                    <DepartmentFilter value={filters.department} onChange={(val) => setFilter("department", val)} />
                    <CompanyFilter value={filters.company} onChange={(val) => setFilter("company", val)} />
                    <BatchFilter value={filters.batch} onChange={(val) => setFilter("batch", val)} />
                    <DateRangeFilter
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      onStartChange={(val) => setFilter("startDate", val)}
                      onEndChange={(val) => setFilter("endDate", val)}
                      error={filterErrors?.dateRange}
                    />
                  </div>
                )}

                {/* C. Right Main list Area */}
                <div className="lg:col-span-3 space-y-4">
                  {/* List Header control bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-100/80 p-4 rounded-2xl shadow-sm no-print gap-4">
                    <ReportTypeFilter
                      activeType={filters.type}
                      onChange={(val) => setFilter("type", val)}
                    />
                    
                    {/* Layout Toggler buttons */}
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/50 p-1.5 rounded-xl self-end sm:self-auto">
                      <button
                        onClick={() => setLayoutMode("table")}
                        className={`p-1.5 rounded-lg transition duration-150 cursor-pointer ${
                          layoutMode === "table" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                        }`}
                        title="Tabular List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setLayoutMode("grid")}
                        className={`p-1.5 rounded-lg transition duration-150 cursor-pointer ${
                          layoutMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                        }`}
                        title="Grid Layout"
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* List Content */}
                  {filteredReportsList.length === 0 ? (
                    <EmptyState onReset={resetFilters} />
                  ) : layoutMode === "table" ? (
                    <ReportTable
                      reports={filteredReportsList}
                      onPreview={(r) => setPreviewingReport(r)}
                      onDelete={(id) => setDeletingReportId(id)}
                      onDownload={(r) => downloadReportFile(r)}
                      downloadingId={exportingId}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredReportsList.map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          onPreview={(r) => setPreviewingReport(r)}
                          onDelete={(id) => setDeletingReportId(id)}
                          onDownload={(r) => downloadReportFile(r)}
                          downloadingId={exportingId}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}
      </main>

      {/* 5. MODALS & SLIDEOUT DRAWER PANELS */}

      {/* modal A: Generate Report Form Modal */}
      {isGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-50 text-primary rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Generate Academic Report</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Parameters and scope definition</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGenModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerateReportSubmit} className="p-6 space-y-4">
              
              {/* Report Name */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Report Name *</label>
                <input
                  type="text"
                  value={formData.reportName}
                  onChange={(e) => handleInputChange("reportName", e.target.value)}
                  placeholder="e.g. Placement Report 2026 Batch CSE"
                  className={`w-full px-3 py-2.5 bg-slate-50 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border focus:ring-4 transition outline-none ${
                    formErrors.reportName 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" 
                      : "border-slate-200 focus:border-primary focus:ring-orange-500/10"
                  }`}
                />
                {formErrors.reportName && (
                  <span className="text-[10px] font-semibold text-red-500">{formErrors.reportName}</span>
                )}
              </div>

              {/* Grid 2x2 for selections */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Report Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    {REPORT_TYPES.map((t) => (
                      <option key={t} value={t}>{t} Report</option>
                    ))}
                  </select>
                </div>

                {/* Batch */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Target Batch *</label>
                  <select
                    value={formData.batch}
                    onChange={(e) => handleInputChange("batch", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    {BATCHES.map((b) => (
                      <option key={b} value={b}>Batch of {b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Department */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Department Scope *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Company */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Hiring Company *</label>
                  <select
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    {COMPANIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Ranges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 text-sm font-semibold rounded-xl border outline-none ${
                      formErrors.startDate ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {formErrors.startDate && (
                    <span className="text-[10px] font-semibold text-red-500">{formErrors.startDate}</span>
                  )}
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 text-sm font-semibold rounded-xl border outline-none ${
                      formErrors.endDate ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                  {formErrors.endDate && (
                    <span className="text-[10px] font-semibold text-red-500">{formErrors.endDate}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase font-sans">Report Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Summarize context or purpose of report generation..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-orange-500/10 transition outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-500/10 active:scale-97 cursor-pointer flex items-center space-x-1.5"
                >
                  {isGenerating ? (
                    <span className="flex items-center space-x-1">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full inline-block"></span>
                      <span>Compiling...</span>
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Compile Report</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* modal B: Details Slideout drawer */}
      <ReportDetails
        report={inspectingReport}
        isOpen={!!inspectingReport}
        onClose={() => setInspectingReport(null)}
        onDownload={(r) => {
          downloadReportFile(r);
          setInspectingReport(null);
        }}
      />

      {/* modal C: Interactive Preview Modal */}
      <ReportPreview
        reportId={previewingReport?.id}
        isOpen={!!previewingReport}
        onClose={() => setPreviewingReport(null)}
        onExportPDF={(r) => exportPDF(r)}
        onExportExcel={(r) => exportExcel(r)}
        onExportCSV={(r) => exportCSV(r)}
        exportingId={exportingId}
      />

      {/* modal D: Deletion Confirmation Alert */}
      <ConfirmationModal
        isOpen={deletingReportId !== null}
        title="Delete Report Template?"
        message="This action will permanently delete the compiled reports dataset and decrement dashboard counts. This cannot be undone."
        confirmLabel="Confirm Delete"
        cancelLabel="Keep Report"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingReportId(null)}
      />

      {/* 6. Footer (No-Print) */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-semibold no-print">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} UpToSkills. College Placements and Career Services Analytics Portal.</p>
          <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Authorized operations console. Unauthorized duplication is flagged.</p>
        </div>
      </footer>

    </div>
  );
};

export default ReportsPage;
