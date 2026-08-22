import { useState, useMemo, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Filter, X, UserPlus, ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Pagination from "../components/common/Pagination";
import BatchFilter from "../components/filters/BatchFilter";
import CompanyFilter from "../components/filters/CompanyFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";
import SearchStudent from "../components/filters/SearchStudent";
import StatusFilter from "../components/filters/StatusFilter";
import DriveSelector from "../components/filters/DriveSelector";

import NominationDetails from "../components/nomination/NominationDetails";
import NominationStatistics from "../components/nomination/NominationStatistics";
import NominationTable from "../components/nomination/NominationTable";
import NominationTabs from "../components/nomination/NominationTabs";
import NominatedTable from "../components/nomination/NominatedTable";
import NominationCard from "../components/nomination/NominationCard";
import StudentNominationForm from "../components/forms/StudentNominationForm";
import EditNominationForm from "../components/forms/EditNominationForm";
import RemoveNominationModal from "../components/forms/RemoveNominationModal";
import ShortlistedStudents from "../components/shortlist/ShortlistedStudents";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

import useStudentNomination from "../hooks/useStudentNomination";
import { getPlacementDrives } from "../../placement-drives/services/placementDriveService";

/* ── Isolated Module Query Client ───────────────────────────────── */
const moduleQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/* ── Main Page Logic Component ───────────────────────────────────── */
const StudentNominationContent = () => {
  const { darkMode } = useOutletContext() || {};

  /* ── Drive selection ────────────────────────────────────────────── */
  const [selectedDriveId, setSelectedDriveId] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [allDrives, setAllDrives] = useState([]);

  useEffect(() => {
    getPlacementDrives().then((res) => {
      if (res?.success) setAllDrives(res.data || []);
    });
  }, []);

  const handleDriveChange = useCallback((driveId) => {
    setSelectedDriveId(driveId);
    setSelectedDrive(allDrives.find((d) => d.id === driveId) || null);
    setSelectedStudentIds([]);
    setCurrentPage(1);
  }, [allDrives]);

  /* ── Hook (re-fetches whenever selectedDriveId changes) ────────── */
  const {
    eligibleStudents = [],
    nominatedStudents = [],
    loading,
    error,
    bulkNominate,
    bulkShortlist,
    nominateStudent,
    refreshData,
  } = useStudentNomination(selectedDriveId);

  /* ── Tab / UI state ─────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("eligible");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* ── Bulk selection ─────────────────────────────────────────────── */
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  /* ── Filters ────────────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  /* ── Form / modal state ─────────────────────────────────────────── */
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [nominatingStudent, setNominatingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removingStudent, setRemovingStudent] = useState(null);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedStudent(null);
    setIsDetailOpen(false);
    setSelectedStudentIds([]);
    setSearchQuery("");
    setSelectedCompany("");
    setSelectedDepartment("");
    setSelectedBatch("");
    setSelectedStatus("");
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
    setSelectedStudentIds([]);
  };

  const handleRetryFetch = () => refreshData();

  /* ── Checkbox helpers ───────────────────────────────────────────── */
  const toggleStudentSelect = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (visibleStudents) => {
    const visibleIds = visibleStudents.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  /* ── Bulk actions ───────────────────────────────────────────────── */
  const handleBulkNominate = async () => {
    if (!selectedDriveId) {
      toast.error("Please select a placement drive first.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Select at least one candidate.");
      return;
    }
    setBulkLoading(true);
    try {
      const res = await bulkNominate(selectedStudentIds);
      if (res?.success) {
        toast.success(res.message || `${selectedStudentIds.length} candidate(s) nominated.`);
        setSelectedStudentIds([]);
        refreshData();
      } else {
        toast.error(res?.message || "Bulk nomination failed.");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkShortlist = async () => {
    if (!selectedDriveId) {
      toast.error("Please select a placement drive first.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Select at least one candidate.");
      return;
    }
    setBulkLoading(true);
    try {
      const res = await bulkShortlist(selectedStudentIds);
      if (res?.success) {
        toast.success(res.message || `${selectedStudentIds.length} candidate(s) shortlisted.`);
        setSelectedStudentIds([]);
        refreshData();
      } else {
        toast.error(res?.message || "Bulk shortlisting failed.");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setBulkLoading(false);
    }
  };

  /* ── Filtering Logic ───────────────────────────────────────────── */
  const students = activeTab === "eligible" ? eligibleStudents : nominatedStudents;

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name?.toLowerCase().includes(q);
        const matchesEnrollment = s.enrollmentNo?.toLowerCase().includes(q);
        if (!matchesName && !matchesEnrollment) return false;
      }
      if (selectedCompany && s.company !== selectedCompany) return false;
      if (selectedDepartment && s.department !== selectedDepartment) return false;
      if (selectedBatch && String(s.batch) !== String(selectedBatch)) return false;
      if (activeTab === "nominated" && selectedStatus && s.status !== selectedStatus) return false;
      return true;
    });
  }, [students, searchQuery, selectedCompany, selectedDepartment, selectedBatch, selectedStatus, activeTab]);

  /* ── Pagination calculations ───────────────────────────────────── */
  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / itemsPerPage) || 1;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const hasActiveFilters =
    selectedCompany !== "" ||
    selectedDepartment !== "" ||
    selectedBatch !== "" ||
    (activeTab === "nominated" && selectedStatus !== "");

  /* ── Bulk Action Bar UI ─────────────────────────────────────────── */
  const BulkActionBar = () => {
    if (selectedStudentIds.length === 0) return null;
    return (
      <div
        className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-3.5 transition-all ${
          darkMode ? "bg-[#2D2D2D] border-[#ff6d34]/30" : "bg-orange-50 border-orange-200"
        }`}
      >
        <span className={`text-sm font-semibold ${darkMode ? "text-[#ff6d34]" : "text-[#ff7a00]"}`}>
          {selectedStudentIds.length} candidate{selectedStudentIds.length > 1 ? "s" : ""} selected
        </span>
        <div className="flex items-center gap-2">
          {activeTab === "eligible" && (
            <button
              onClick={handleBulkNominate}
              disabled={bulkLoading || !selectedDriveId}
              className="flex items-center gap-2 rounded-xl bg-[#ff7a00] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#e06b00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus size={14} />
              {bulkLoading ? "Nominating…" : "Nominate Selected"}
            </button>
          )}
          {activeTab === "nominated" && (
            <button
              onClick={handleBulkShortlist}
              disabled={bulkLoading || !selectedDriveId}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ListChecks size={14} />
              {bulkLoading ? "Shortlisting…" : "Shortlist Selected"}
            </button>
          )}
          <button
            onClick={() => setSelectedStudentIds([])}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              darkMode ? "border-[#3D3D3D] hover:bg-[#3D3D3D]" : "border-slate-300 hover:bg-slate-100"
            }`}
          >
            Clear
          </button>
        </div>
      </div>
    );
  };

  /* ── Checkable Nomination Table Wrapper ────────────────────────── */
  const CheckableTable = ({ isNominated }) => {
    const tableStudents = currentStudents;
    const visibleIds = tableStudents.map((s) => s.id);
    const allChecked = visibleIds.length > 0 && visibleIds.every((id) => selectedStudentIds.includes(id));
    const someChecked = visibleIds.some((id) => selectedStudentIds.includes(id));

    return (
      <div className="flex min-w-0 h-full flex-1 flex-col">
        {/* Select-all top toolbar */}
        {selectedDriveId && tableStudents.length > 0 && (
          <div
            className={`flex items-center gap-3 px-5 py-2.5 rounded-t-2xl border-b text-sm ${
              darkMode
                ? "bg-[#1A1A1A]/60 border-[#3D3D3D] text-slate-400"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <input
              type="checkbox"
              checked={allChecked}
              ref={(el) => {
                if (el) el.indeterminate = someChecked && !allChecked;
              }}
              onChange={() => toggleSelectAll(tableStudents)}
              className="h-4 w-4 rounded accent-[#ff7a00] cursor-pointer"
              aria-label="Select all visible candidates"
            />
            <span className="font-medium text-xs">
              {allChecked ? "Deselect page" : `Select page (${visibleIds.length})`}
            </span>
          </div>
        )}

        {!isNominated ? (
          <NominationTable
            students={tableStudents}
            totalStudents={totalStudents}
            selectedStudent={selectedStudent}
            isDetailOpen={isDetailOpen}
            setSelectedStudent={setSelectedStudent}
            setIsDetailOpen={setIsDetailOpen}
            onNominate={(s) => {
              if (selectedDriveId) {
                setBulkLoading(true);
                bulkNominate([s.id]).then((res) => {
                  setBulkLoading(false);
                  if (res?.success) {
                    toast.success(`${s.name} nominated.`);
                    refreshData();
                  } else {
                    toast.error(res?.message || "Nomination failed.");
                  }
                });
              } else {
                setNominatingStudent(s);
                setShowNominationForm(true);
              }
            }}
            selectedIds={selectedStudentIds}
            onToggleSelect={selectedDriveId ? toggleStudentSelect : null}
          />
        ) : (
          <NominatedTable
            students={tableStudents}
            totalStudents={totalStudents}
            selectedStudent={selectedStudent}
            isDetailOpen={isDetailOpen}
            setSelectedStudent={setSelectedStudent}
            setIsDetailOpen={setIsDetailOpen}
            onEditNomination={(s) => {
              setEditingStudent(s);
              setShowEditForm(true);
            }}
            onRemoveNomination={(s) => {
              setRemovingStudent(s);
              setShowRemoveModal(true);
            }}
            onReNominate={(s) => {
              setNominatingStudent(s);
              setShowNominationForm(true);
            }}
            onMarkSelected={() => refreshData()}
            selectedIds={selectedStudentIds}
            onToggleSelect={selectedDriveId ? toggleStudentSelect : null}
          />
        )}
      </div>
    );
  };

  /* ── Render Component ───────────────────────────────────────────── */
  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6 px-2 py-4 sm:px-4 lg:px-6 overflow-hidden">
      <NominationStatistics />

      {/* Drive Selector */}
      <div className="w-full">
        <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Select Active Placement Drive
        </p>
        <DriveSelector selectedDriveId={selectedDriveId} onDriveChange={handleDriveChange} />
        {selectedDriveId && (
          <p className={`mt-1.5 text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Showing eligible candidates and active nominations filtered for selected drive.
          </p>
        )}
      </div>

      <NominationTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        eligibleCount={eligibleStudents.length}
        nominatedCount={nominatedStudents.length}
      />

      {/* Search Bar + Mobile Filter Toggle */}
      <div className="mt-2 flex gap-3 items-center w-full">
        <div className="flex-1 min-w-0">
          <SearchStudent value={searchQuery} onChange={handleFilterChange(setSearchQuery)} />
        </div>
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          aria-label="Toggle filters"
          className={`md:hidden flex items-center justify-center p-3.5 rounded-2xl border relative shrink-0 transition-all ${
            darkMode
              ? "border-[#3D3D3D] bg-[#2D2D2D] text-gray-300 hover:bg-[#3D3D3D]"
              : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter size={18} strokeWidth={2.2} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff7a00] ring-2 ring-[#ff7a00]/30 animate-pulse" />
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div
        className={`hidden md:grid grid-cols-1 gap-4 w-full ${
          activeTab === "eligible" ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        <CompanyFilter value={selectedCompany} onChange={handleFilterChange(setSelectedCompany)} />
        <DepartmentFilter value={selectedDepartment} onChange={handleFilterChange(setSelectedDepartment)} />
        {activeTab === "nominated" && (
          <StatusFilter value={selectedStatus} onChange={handleFilterChange(setSelectedStatus)} />
        )}
        <BatchFilter value={selectedBatch} onChange={handleFilterChange(setSelectedBatch)} />
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar />

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs md:hidden">
          <div
            className={`w-full max-w-md rounded-t-3xl border-t shadow-2xl flex flex-col max-h-[85vh] ${
              darkMode ? "bg-[#1A1A1A] border-[#3D3D3D] text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <div className={`flex items-center justify-between border-b p-5 shrink-0 ${darkMode ? "border-[#3D3D3D]" : "border-slate-100"}`}>
              <h3 className="text-base font-bold">Filter Options</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className={`p-1.5 rounded-xl border ${darkMode ? "border-[#3D3D3D] bg-[#2D2D2D]" : "border-slate-200 bg-slate-50"}`}
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 pb-36">
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Company</span>
                <CompanyFilter value={selectedCompany} onChange={handleFilterChange(setSelectedCompany)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Department</span>
                <DepartmentFilter value={selectedDepartment} onChange={handleFilterChange(setSelectedDepartment)} />
              </div>
              {activeTab === "nominated" && (
                <div className="flex flex-col gap-1.5">
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Status</span>
                  <StatusFilter value={selectedStatus} onChange={handleFilterChange(setSelectedStatus)} />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Batch Year</span>
                <BatchFilter value={selectedBatch} onChange={handleFilterChange(setSelectedBatch)} />
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-3 p-4 border-t shrink-0 ${darkMode ? "border-[#3D3D3D] bg-[#1A1A1A]" : "border-slate-100 bg-white"}`}>
              <button
                onClick={() => {
                  setSelectedCompany("");
                  setSelectedDepartment("");
                  setSelectedBatch("");
                  setSelectedStatus("");
                  setIsMobileFilterOpen(false);
                }}
                className={`w-full py-3 text-sm font-semibold rounded-xl border transition-colors ${
                  darkMode
                    ? "border-[#3D3D3D] text-gray-400 hover:text-white hover:bg-[#2D2D2D]"
                    : "border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 text-sm font-semibold rounded-xl bg-[#ff7a00] hover:bg-[#e06b00] text-white shadow-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetryFetch} />
      ) : showNominationForm ? (
        <StudentNominationForm
          student={nominatingStudent}
          selectedDrive={selectedDrive}
          onClose={() => {
            setShowNominationForm(false);
            setNominatingStudent(null);
          }}
          onSave={async (data) => {
            const res = await nominateStudent(data);
            if (res?.isValid) {
              setShowNominationForm(false);
              setNominatingStudent(null);
              toast.success(res.message || "Candidate nominated.");
              refreshData();
            } else {
              toast.error(res?.errors?.service || res?.errors?.student || "Failed to nominate.");
            }
          }}
        />
      ) : showEditForm ? (
        <EditNominationForm
          student={editingStudent}
          onClose={() => {
            setShowEditForm(false);
            setEditingStudent(null);
          }}
          onSave={async () => {
            await refreshData();
            setShowEditForm(false);
            setEditingStudent(null);
          }}
        />
      ) : showRemoveModal ? (
        <RemoveNominationModal
          student={removingStudent}
          onClose={() => {
            setShowRemoveModal(false);
            setRemovingStudent(null);
          }}
          onRemove={async () => {
            await refreshData();
            setShowRemoveModal(false);
            setRemovingStudent(null);
          }}
        />
      ) : totalStudents === 0 ? (
        <EmptyState
          title={selectedDriveId ? "No candidates match this drive" : "No candidates found"}
          description={
            selectedDriveId
              ? "No eligible candidates meet this drive's criteria."
              : "Try clearing active search filters or selecting a placement drive."
          }
        />
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:flex h-167 gap-4 min-w-0">
            <CheckableTable isNominated={activeTab === "nominated"} />
            <div className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${isDetailOpen ? "w-[520px] shrink-0" : "w-0"}`}>
              <NominationDetails
                student={selectedStudent}
                isOpen={isDetailOpen}
                onClose={() => {
                  setSelectedStudent(null);
                  setIsDetailOpen(false);
                }}
              />
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden">
            <NominationCard
              students={currentStudents}
              hasSearched={true}
              activeTab={activeTab}
              onNominate={(s) => {
                setNominatingStudent(s);
                setShowNominationForm(true);
              }}
              onEditNomination={(s) => {
                setEditingStudent(s);
                setShowEditForm(true);
              }}
              onRemoveNomination={(s) => {
                setRemovingStudent(s);
                setShowRemoveModal(true);
              }}
              onReNominate={(s) => {
                setNominatingStudent(s);
                setShowNominationForm(true);
              }}
              onMarkSelected={() => refreshData()}
              getStudentActions={(s) => {
                switch (s.status) {
                  case "Waiting":
                  case "Nominated":
                    return { canEdit: true, canRemove: true };
                  case "Rejected":
                    return { canReNominate: true };
                  case "Shortlisted":
                    return { canMarkSelected: true };
                  case "Selected":
                    return { isSelected: true };
                  default:
                    return {};
                }
              }}
            />
          </div>
        </>
      )}

      {/* Dynamic Server/Client Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={itemsPerPage}
        totalItems={totalStudents}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />

      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <ShortlistedStudents />
      </div>
    </div>
  );
};

/* ── Exported Page Wrapper Component ──────────────────────────────── */
export default function StudentNominationPage(props) {
  return (
    <QueryClientProvider client={moduleQueryClient}>
      <StudentNominationContent {...props} />
    </QueryClientProvider>
  );
}