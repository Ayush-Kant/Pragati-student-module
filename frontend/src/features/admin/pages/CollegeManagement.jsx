import { useOutletContext } from "react-router-dom";
import { mockColleges } from "../mockCollegeData";
import CollegeTable from "../components/CollegeTable";
import useCollegeManagement from "../hooks/useCollegeManagement";
import CollegeRankingTable from "../components/CollegeRankingsTable";
import { mockRankings } from "../mockCollegeData";
import NeedsRecruitmentList from "../components/NeedsRecruitmentList";
import { mockNeedsRecruitment } from "../mockCollegeData";



export default function CollegeManagement() {
    const { darkMode } = useOutletContext();
    const {
        currentColleges,
        currentPage,
        setCurrentPage,
        totalPages,
        search,
        setSearch,
        status,
        setStatus,
        department,
        setDepartment,
        filteredColleges,
        needsRecruitment,
        rankings,
        loading,
        fetchColleges,
    } = useCollegeManagement();

    return (
        <div className={`p-4 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
            <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>College Management</h1>
            <p className={`${darkMode ? "text-slate-300" : "text-gray-500"} mb-6`}>
                Approve institutions, monitor placement performance
            </p>
            {/* Search + Filters */}
            <div className={`p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 transition ${darkMode ? "bg-slate-950 shadow-black/30 border border-slate-700" : "bg-white shadow-slate-200"}`}>
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search college..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full rounded border px-3 py-2 transition ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-400" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"}`}
                />
                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`rounded border px-3 py-2 cursor-pointer transition ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>
                {/* Department */}
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`rounded border px-3 py-2 transition ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                />
            </div>
            <div className="mt-6">
                <p className="font-semibold">
                    {
                        filteredColleges.length === 0
                            ? "No colleges found"
                            : `Showing ${filteredColleges.length} colleges`
                    }
                </p>
                {
                    loading ?
                        <div className="bg-white dark:bg-gray-200 shadow rounded-lg p-6 animate-pulse">
                            <div className="space-y-4">
                                <div className="h-12 bg-gray-100 dark:bg-gray-300 rounded"></div>
                                <div className="h-12 bg-gray-100 dark:bg-gray-300 rounded"></div>
                                <div className="h-12 bg-gray-100 dark:bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    :
                        <CollegeTable colleges={currentColleges} refreshColleges={fetchColleges} darkMode={darkMode} />
                }

                {
                    filteredColleges.length > 0 && (
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
                <NeedsRecruitmentList
                    colleges={mockNeedsRecruitment}
                    darkMode={darkMode}
                />
                {/* Use this when backend is prepared
                <NeedsRecruitmentList
                    colleges={needsRecruitment}
                /> */}
                <CollegeRankingTable
                    rankings={mockRankings}
                    darkMode={darkMode}
                />
                {/* Use when backend is ready
                <CollegeRankingTable
                    rankings={rankings}
                /> */}
            </div>
        </div>
    );
}
