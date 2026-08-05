import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Table, Grid, Building2, Calendar, CheckCircle2, Award } from "lucide-react";
import toast from "react-hot-toast";

// Hooks
import usePlacementDrives from "../hooks/usePlacementDrives";
import useDriveFilters from "../hooks/useDriveFilters";
import useDriveStatistics from "../hooks/useDriveStatistics";

// Visualization Components
import DriveTable from "../components/drive/DriveTable";
import DriveCard from "../components/drive/DriveCard";
import DriveDetails from "../components/drive/DriveDetails";
import DriveStatisticsCard from "../components/drive/DriveStatisticsCard";

// Forms & Modals
import PlacementDriveForm from "../components/forms/PlacementDriveForm";
import EditPlacementDriveForm from "../components/forms/EditPlacementDriveForm";
import DeletePlacementDriveModal from "../components/forms/DeletePlacementDriveModal";

// Filter Components
import SearchDrive from "../components/filters/SearchDrive";
import CompanyFilter from "../components/filters/CompanyFilter";
import StatusFilter from "../components/filters/StatusFilter";
import DateFilter from "../components/filters/DateFilter";

// Common Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

const PlacementDrivesPage = () => {
  const { darkMode } = useOutletContext();
  const {
    drives,
    loading,
    error,
    addDrive,
    editDrive,
    removeDrive,
    fetchDrives,
  } = usePlacementDrives();

  // Filters State & Logic
  const {
    filteredDrives,
    searchTerm,
    setSearchTerm,
    companyFilter,
    setCompanyFilter,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
  } = useDriveFilters(drives);

  // Statistics Hook
  const statistics = useDriveStatistics(drives);

  // View Mode: "table" or "grid"
  const [viewMode, setViewMode] = useState("table");

  // Modal Control States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEditDrive, setSelectedEditDrive] = useState(null);
  const [selectedDeleteDriveId, setSelectedDeleteDriveId] = useState(null);
  const [selectedViewDrive, setSelectedViewDrive] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Loading / Error Handlers
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] ${darkMode ? 'bg-[#1A1A1A]' : ''}`}>
        <LoadingSpinner message="Loading placement drives data..." darkMode={darkMode} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-10">
        <ErrorState message={error} onRetry={fetchDrives} />
      <div className={`p-8 max-w-2xl mx-auto mt-10 ${darkMode ? 'bg-[#1A1A1A]' : ''}`}>
        <ErrorState message={error} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${darkMode ? 'bg-[#1A1A1A] min-h-screen p-6' : ''}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Placement Drive Management</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Dashboard &rsaquo; Drive Management
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#ff7a00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e06b00] active:scale-95 transition-all shadow-sm shrink-0"
        >
          <Plus size={16} />
          <span>New Placement Drive</span>
        </button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DriveStatisticsCard
          title="Total Drives"
          value={statistics.totalDrives}
          icon={Building2}
          colorClass="bg-orange-50 text-[#ff7a00]"
          borderClass={darkMode ? "border-[#3D3D3D]" : "border-gray-150"}
          darkMode={darkMode}
        />
        <DriveStatisticsCard
          title="Open Drives"
          value={statistics.openDrives}
          icon={CheckCircle2}
          colorClass="bg-green-50 text-green-600"
          borderClass={darkMode ? "border-[#3D3D3D]" : "border-gray-150"}
          darkMode={darkMode}
        />
        <DriveStatisticsCard
          title="Upcoming Drives"
          value={statistics.upcomingDrives}
          icon={Calendar}
          colorClass="bg-blue-50 text-blue-600"
          borderClass={darkMode ? "border-[#3D3D3D]" : "border-gray-150"}
          darkMode={darkMode}
        />
        <DriveStatisticsCard
          title="Completed Drives"
          value={statistics.completedDrives}
          icon={Award}
          colorClass="bg-gray-50 text-gray-600"
          borderClass={darkMode ? "border-[#3D3D3D]" : "border-gray-150"}
          darkMode={darkMode}
        />
      </div>

      {/* Search, Filter, and View Toggles Bar */}
      <div className={`flex flex-col gap-4 p-5 rounded-2xl shadow-sm ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-150'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <SearchDrive searchTerm={searchTerm} setSearchTerm={setSearchTerm} darkMode={darkMode} />

          <div className="flex flex-wrap items-center gap-3">
            <CompanyFilter
              companies={Array.from(new Set(drives.map((d) => d.company))).filter(Boolean)}
              selectedCompany={companyFilter}
              setSelectedCompany={setCompanyFilter}
              darkMode={darkMode}
            />
            <StatusFilter
              selectedStatus={statusFilter}
              setSelectedStatus={setStatusFilter}
              darkMode={darkMode}
            />
            <DateFilter
              selectedDate={dateFilter}
              setSelectedDate={setDateFilter}
              darkMode={darkMode}
            />

            {/* View Mode Switcher */}
            <div className={`flex items-center border rounded-lg p-0.5 shrink-0 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-250 bg-gray-50'}`}>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "table"
                    ? darkMode ? "bg-[#2D2D2D] text-[#ff6d34] shadow-sm" : "bg-white text-gray-800 shadow-sm"
                    : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Table View"
              >
                <Table size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "grid"
                    ? darkMode ? "bg-[#2D2D2D] text-[#ff6d34] shadow-sm" : "bg-white text-gray-800 shadow-sm"
                    : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Grid Card View"
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredDrives.length === 0 ? (
        <div className={`rounded-2xl py-12 px-4 shadow-sm ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white border border-gray-150'}`}>
          <EmptyState
            title="No Drives Found"
            message="We couldn't find any placement drives matching your search parameters. Try relaxing your filters."
            darkMode={darkMode}
          />
        </div>
      ) : viewMode === "table" ? (
        <DriveTable
          drives={filteredDrives}
          onView={setSelectedViewDrive}
          onEdit={setSelectedEditDrive}
          onDelete={setSelectedDeleteDriveId}
          darkMode={darkMode}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrives.map((drive) => (
            <div key={drive.id}>
              <DriveCard
                drive={drive}
                onView={setSelectedViewDrive}
                onEdit={setSelectedEditDrive}
                onDelete={setSelectedDeleteDriveId}
                darkMode={darkMode}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modals and Forms Integration */}

      {/* Create Drive Modal */}
      {isCreateOpen && (
        <PlacementDriveForm
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={addDrive}
          darkMode={darkMode}
        />
      )}

      {/* Edit Drive Modal */}
      {selectedEditDrive && (
        <EditPlacementDriveForm
          isOpen={!!selectedEditDrive}
          onClose={() => setSelectedEditDrive(null)}
          onSubmit={(updatedData) => editDrive(selectedEditDrive.id, updatedData)}
          driveData={selectedEditDrive}
          darkMode={darkMode}
        />
      )}

      {/* View Drive Details Modal */}
      {selectedViewDrive && (
        <DriveDetails
          isOpen={!!selectedViewDrive}
          onClose={() => setSelectedViewDrive(null)}
          drive={selectedViewDrive}
          darkMode={darkMode}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedDeleteDriveId && (
        <DeletePlacementDriveModal
          isOpen={!!selectedDeleteDriveId}
          onCancel={() => setSelectedDeleteDriveId(null)}
          isLoading={isDeleting}
          onConfirm={async () => {
            if (isDeleting) return;
            setIsDeleting(true);
            try {
              const idToDelete = selectedDeleteDriveId;
              const res = await removeDrive(idToDelete);
              if (res && res.success) {
                toast.success("Placement drive deleted successfully!");
                setSelectedDeleteDriveId(null);
              } else {
                toast.error(res?.error || "Failed to delete placement drive.");
              }
            } finally {
              setIsDeleting(false);
            }
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default PlacementDrivesPage;