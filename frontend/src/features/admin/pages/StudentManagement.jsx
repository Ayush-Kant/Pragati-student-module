import { useOutletContext } from "react-router-dom";

import useStudentManagement from "../hooks/useStudentManagement";
import StudentTable from "../components/StudentTable";
import StudentExportButton from "../components/StudentExportButton";

const StudentManagement = () => {
    const { darkMode } = useOutletContext();
    const {
    students,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredStudents
    } = useStudentManagement();
  if (loading) {
    return (
      <div className="p-6">
        <h2>Loading students...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className={`p-4 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
    <div className="flex justify-between items-center mb-6">
    <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
      Student Management
    </h1>

    <StudentExportButton />
  </div>

  <div className={`p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white shadow-slate-200"}`}>
    <input
      type="text"
      placeholder="Search by name or email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={`w-full rounded border px-3 py-2 transition ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"}`}    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className={`rounded border px-3 py-2 transition ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
    >
      <option value="">All Status</option>
      <option value="Verified">Verified</option>
      <option value="Pending">Pending</option>
      <option value="Blocked">Blocked</option>
    </select>
  </div>
    <div>  
        <p className="mt-6 font-semibold margin-bottom-2">
            {
                filteredStudents.length === 0
                    ? "No students found"
                    : `Showing ${filteredStudents.length} students`
            }
        </p>
        <StudentTable students={students} darkMode={darkMode} />
   </div>
    {
        filteredStudents.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded cursor-pointer"
                >
                    Prev
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded cursor-pointer"
                >
                    Next
                </button>
            </div>
        )
    }
</div>
  );
};

export default StudentManagement;