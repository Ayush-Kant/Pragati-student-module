import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; 
import { Filter, X } from "lucide-react"; 
import Pagination from "../components/common/Pagination";

import BatchFilter from "../components/filters/BatchFilter";
import CompanyFilter from "../components/filters/CompanyFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";
import SearchStudent from "../components/filters/SearchStudent";
import StatusFilter from "../components/filters/StatusFilter";

import NominationDetails from "../components/nomination/NominationDetails";
import NominationStatistics from "../components/nomination/NominationStatistics";
import NominationTable from "../components/nomination/NominationTable";
import StudentNominationForm from "../components/forms/StudentNominationForm";

import ShortlistedStudents from "../components/shortlist/ShortlistedStudents";

import NominationTabs from "../components/nomination/NominationTabs";
import NominatedTable from "../components/nomination/NominatedTable";
import EditNominationForm from "../components/forms/EditNominationForm";
import RemoveNominationModal from "../components/forms/RemoveNominationModal";

import {
  eligibleStudents,
  nominatedStudents,
} from "../types/studentNominationDummyData";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import NominationCard from "../components/nomination/NominationCard";

const StudentNominationPage = () => {
  const { darkMode } = useOutletContext();

  /* =====================================================
                        Page State
  ===================================================== */
  const [activeTab, setActiveTab] = useState("eligible");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =====================================================
                        Filter States
  ===================================================== */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* =====================================================
                  Form / Modal States (FIXED)
  ===================================================== */
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [nominatingStudent, setNominatingStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removingStudent, setRemovingStudent] = useState(null);

  /* =====================================================
                  Responsive Page Sizing Logic
  ===================================================== */
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 768 ? 3 : 8);
  // NEW: Create a dynamic array slicing boundary hook for the shortlisted card container
  const [shortlistLimit, setShortlistLimit] = useState(window.innerWidth < 768 ? 3 : undefined);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 8);
      setShortlistLimit(window.innerWidth < 768 ? 3 : undefined);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =====================================================
                        Data States
  ==================================================== */
  const [eligibleData, setEligibleData] = useState(eligibleStudents);
  const [nominatedData, setNominatedData] = useState(nominatedStudents);

  /* =====================================================
                        Handlers
  ===================================================== */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedStudent(null);
    setIsDetailOpen(false);
    setError(null);
    setSearchQuery("");
    setSelectedCompany("");
    setSelectedDepartment("");
    setSelectedBatch("");
    setSelectedStatus("");
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleReNominate = (student) => {
    try {
      setError(null);
      setNominatedData((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, status: "Waiting", remarks: "Re-nominated by Admin" } : s))
      );
    } catch (err) {
      setError("Failed to execute re-nomination workflow action.");
    }
  };

  const handleMarkSelected = (student) => {
    try {
      setError(null);
      setNominatedData((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, status: "Selected" } : s))
      );
    } catch (err) {
      setError("Failed to change student eligibility criteria status flag.");
    }
  };

  const handleRetryFetch = () => {
    setError(null);
    setEligibleData(eligibleStudents);
    setNominatedData(nominatedStudents);
  };

  const hasActiveFilters = selectedCompany !== "" || selectedDepartment !== "" || selectedBatch !== "" || (activeTab === "nominated" && selectedStatus !== "");
  const hasSearched = searchQuery.trim().length > 0;

  /* =====================================================
                        Filtering Logic
  ===================================================== */
  const baseStudents = activeTab === "eligible" ? eligibleData : nominatedData;

  const filteredStudents = useMemo(() => {
    return baseStudents.filter((student) => {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = student.name?.toLowerCase().startsWith(query);
        const matchesEnrollment = student.enrollmentNo?.toLowerCase().startsWith(query);
        if (!matchesName && !matchesEnrollment) return false;
      }

      if (selectedCompany !== "" && student.company !== selectedCompany) return false;
      if (selectedDepartment !== "" && student.department !== selectedDepartment) return false;
      if (selectedBatch !== "" && String(student.batch) !== String(selectedBatch)) return false;
      if (activeTab === "nominated" && selectedStatus !== "" && student.status !== selectedStatus) return false;

      return true;
    });
  }, [baseStudents, searchQuery, selectedCompany, selectedDepartment, selectedBatch, selectedStatus, activeTab]);

  /* =====================================================
                        Pagination Computation
  ===================================================== */
  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6 px-2 py-4 sm:px-4 lg:px-6 overflow-hidden">
      <NominationStatistics />

      <NominationTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        eligibleCount={eligibleData.length}
        nominatedCount={nominatedData.length}
      />

      <div className="mt-2 flex gap-3 items-center w-full">
        <div className="flex-1 min-w-0">
          <SearchStudent 
            value={searchQuery} 
            onChange={handleFilterChange(setSearchQuery)} 
          />
        </div>
        
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  aria-label="Toggle structural filters drawer grid"
                  className={`md:hidden flex items-center justify-center p-3.5 rounded-2xl border relative shrink-0 transition-all duration-200 ${
                    darkMode
                      ? "border-[#3D3D3D] bg-[#2D2D2D] hover:bg-[#3D3D3D] text-gray-300"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Filter size={18} strokeWidth={2.2} />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff7a00] ring-2 ring-[#ff7a00]/30 animate-pulse" />
                  )}
                </button>
      </div>

      <div 
        className={`hidden md:grid grid-cols-1 gap-4 w-full ${
          activeTab === "eligible" 
            ? "md:grid-cols-3" 
            : "md:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        <CompanyFilter value={selectedCompany} onChange={handleFilterChange(setSelectedCompany)} />
        <DepartmentFilter value={selectedDepartment} onChange={handleFilterChange(setSelectedDepartment)} />
        {activeTab === "nominated" && (
          <StatusFilter value={selectedStatus} onChange={handleFilterChange(setSelectedStatus)} />
        )}
        <BatchFilter value={selectedBatch} onChange={handleFilterChange(setSelectedBatch)} />
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs md:hidden animate-fade-in">
          <div 
            className={`w-full max-w-md rounded-t-3xl border-t shadow-2xl transition-all duration-300 transform translate-y-0 flex flex-col max-h-[85vh] ${
              darkMode ? "bg-[#1A1A1A] border-[#3D3D3D] text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <div className={`flex items-center justify-between border-b p-5 shrink-0 ${darkMode ? "border-[#3D3D3D]" : "border-slate-100"}`}>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Filter Options</h3>
                {hasActiveFilters && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20">Active</span>
                )}
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)} 
                className={`p-1.5 rounded-xl border transition-colors ${darkMode ? "border-[#3D3D3D] bg-[#2D2D2D] text-gray-400 hover:text-white" : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800"}`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 pb-36">
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold px-0.5 ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Company</span>
                <CompanyFilter value={selectedCompany} onChange={handleFilterChange(setSelectedCompany)} />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold px-0.5 ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Department</span>
                <DepartmentFilter value={selectedDepartment} onChange={handleFilterChange(setSelectedDepartment)} />
              </div>
              
              {activeTab === "nominated" && (
                <div className="flex flex-col gap-1.5">
                  <span className={`text-xs font-semibold px-0.5 ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Status Flag</span>
                  <StatusFilter value={selectedStatus} onChange={handleFilterChange(setSelectedStatus)} />
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <span className={`text-xs font-semibold px-0.5 ${darkMode ? "text-gray-400" : "text-slate-500"}`}>Batch Year</span>
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
                  darkMode ? "border-[#3D3D3D] text-gray-400 hover:text-white hover:bg-[#2D2D2D]" : "border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Clear Filters
              </button>
              <button 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="w-full py-3 text-sm font-semibold rounded-xl bg-[#ff7a00] hover:bg-[#e06b00] text-white shadow-lg shadow-[#ff7a00]/15 active:scale-[0.98] transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={handleRetryFetch} />
      ) : showNominationForm ? (
        <StudentNominationForm student={nominatingStudent} onClose={() => { setShowNominationForm(false); setNominatingStudent(null); }} onSave={(newNomination) => { try { setEligibleData((prev) => prev.filter((student) => student.id !== newNomination.id)); setNominatedData((prev) => [newNomination, ...prev]); setShowNominationForm(false); setNominatingStudent(null); } catch (err) { setError("An error occurred while saving the new student nomination mapping."); } }} />
      ) : showEditForm ? (
        <EditNominationForm student={editingStudent} onClose={() => { setShowEditForm(false); setEditingStudent(null); }} onSave={(updatedNomination) => { try { setNominatedData((prev) => prev.map((student) => student.id === updatedNomination.id ? updatedNomination : student)); setEditingStudent(updatedNomination); setShowEditForm(false); } catch (err) { setError("An error occurred during updating specific student records data values."); } }} />
      ) : showRemoveModal ? (
        <RemoveNominationModal student={removingStudent} onClose={() => { setShowRemoveModal(false); setRemovingStudent(null); }} onRemove={(updatedStudent) => { try { setNominatedData((prev) => prev.filter((student) => student.id !== updatedStudent.id)); const eligibleStudent = { ...updatedStudent, company: "--", role: "--", package: "--", remarks: "", shortlistedDate: "--", status: "Eligible", }; setEligibleData((prev) => [...prev, eligibleStudent]); setShowRemoveModal(false); setRemovingStudent(null); } catch (err) { setError("Failed to cleanly shift back to active eligible pool array index values."); } }} />
      ) : (
        <>
          {totalStudents === 0 ? (
            <EmptyState title="No Match Found" description="Try clearing structural filter parameters to match target variables." />
          ) : (
            <>
              {/* Desktop View Table Block */}
              <div className="hidden md:flex h-167 gap-4 min-w-0">
                <div className="flex min-w-0 h-full flex-1 flex-col">
                  {activeTab === "eligible" ? (
                    <NominationTable students={currentStudents} totalStudents={totalStudents} selectedStudent={selectedStudent} isDetailOpen={isDetailOpen} setSelectedStudent={setSelectedStudent} setIsDetailOpen={setIsDetailOpen} onNominate={(student) => { setNominatingStudent(student); setShowNominationForm(true); }} />
                  ) : (
                    <NominatedTable students={currentStudents} totalStudents={totalStudents} selectedStudent={selectedStudent} isDetailOpen={isDetailOpen} setSelectedStudent={setSelectedStudent} setIsDetailOpen={setIsDetailOpen} onEditNomination={(student) => { setEditingStudent(student); setShowEditForm(true); }} onRemoveNomination={(student) => { setRemovingStudent(student); setShowRemoveModal(true); }} onReNominate={handleReNominate} onMarkSelected={handleMarkSelected} />
                  )}
                </div>

                <div className={`h-full overflow-hidden transition-all duration-300 ease-in-out ${isDetailOpen ? "w-[520px] shrink-0" : "w-0"}`}>
                  <NominationDetails student={selectedStudent} isOpen={isDetailOpen} onClose={() => { setSelectedStudent(null); setIsDetailOpen(false); }} />
                </div>
              </div>

              {/* Mobile Card Layout Interface View */}
              <div className="block md:hidden">
                <NominationCard
                  students={currentStudents}
                  hasSearched={true} 
                  activeTab={activeTab}
                  onNominate={(student) => {
                    setNominatingStudent(student);
                    setShowNominationForm(true);
                  }}
                  onEditNomination={(student) => {
                    setEditingStudent(student);
                    setShowEditForm(true);
                  }}
                  onRemoveNomination={(student) => {
                    setRemovingStudent(student);
                    setShowRemoveModal(true);
                  }}
                  onReNominate={handleReNominate}
                  onMarkSelected={handleMarkSelected}
                  getStudentActions={(student) => {
                    switch (student.status) {
                      case "Waiting":
                      case "Nominated": return { canEdit: true, canRemove: true };
                      case "Rejected": return { canReNominate: true };
                      case "Shortlisted": return { canMarkSelected: true };
                      case "Selected": return { isSelected: true };
                      default: return {};
                    }
                  }}
                />
              </div>
            </>
          )}
        </>
      )}

      {totalStudents > itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <div className="w-full min-w-0 max-w-full overflow-hidden">
        {/* MODIFIED: Pass the responsive display limit down to the Shortlisted component */}
        <ShortlistedStudents limit={shortlistLimit} />
      </div>
    </div>
  );
};

export default StudentNominationPage;