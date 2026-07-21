import React from "react";
import { Download } from "lucide-react";
import useMentees from "../hooks/useMentees";
import useStudentProfile from "../hooks/useStudentProfile";
import MenteeStatsGrid from "../components/MenteeStatsGrid";
import MenteeFilterBar from "../components/MenteeFilterBar";
import MenteeDataTable from "../components/MenteeDataTable";
import StudentProfileDrawer from "../components/StudentProfileDrawer";

export default function MenteeManagementPage() {
  const {
    mentees,
    rawMentees,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalEntries,
    itemsPerPage,
    filterOptions
  } = useMentees();

  const {
    isOpen,
    selectedStudentId,
    profile,
    loading: profileLoading,
    notes,
    setNotes,
    savingNotes,
    openProfile,
    closeProfile,
    saveNotes
  } = useStudentProfile();

  // Export filtered mentees list as CSV
  const handleExportCSV = () => {
    if (rawMentees.length === 0) return;
    
    // Define headers
    const headers = ["Student Name", "Email", "Course", "Batch", "Progress %", "Attendance %", "Last Active", "Status"];
    
    // Create rows
    const rows = rawMentees.map(m => [
      m.name,
      m.email,
      m.course,
      m.batch,
      m.progress,
      m.attendance,
      m.lastActive,
      m.status
    ]);

    // Format content
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mentees_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find attendance in list for selected drawer student
  const selectedStudentAttendance = React.useMemo(() => {
    const student = rawMentees.find((m) => m.id === selectedStudentId);
    return student ? student.attendance : "0%";
  }, [rawMentees, selectedStudentId]);

  return (
    <div className="w-full">
      {/* CSS Animation Injector */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Header section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Mentees</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage, monitor, and communicate with your students.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-4.5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 cursor-pointer"
        >
          <Download className="h-4.5 w-4.5" />
          Export Report
        </button>
      </div>

      {/* Stats Bento Grid */}
      <MenteeStatsGrid stats={stats} />

      {/* Error Callout */}
      {error && (
        <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          ⚠️ {error}
        </div>
      )}

      {/* Filters Area */}
      <MenteeFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        handleFilterChange={handleFilterChange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterOptions={filterOptions}
      />

      {/* Data Table */}
      <MenteeDataTable
        mentees={mentees}
        loading={loading}
        onViewProfile={openProfile}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalEntries={totalEntries}
        itemsPerPage={itemsPerPage}
      />

      {/* Side Slide-out Profile Drawer */}
      <StudentProfileDrawer
        isOpen={isOpen}
        onClose={closeProfile}
        profile={profile}
        loading={profileLoading}
        notes={notes}
        setNotes={setNotes}
        savingNotes={savingNotes}
        onSaveNotes={saveNotes}
        studentAttendance={selectedStudentAttendance}
      />
    </div>
  );
}
