import { mockColleges } from "../mockCollegeData";
import CollegeTable from "../components/CollegeTable";
import useCollegeManagement from "../hooks/useCollegeManagement";
import CollegeRankingTable from "../components/CollegeRankingsTable";
import { mockRankings } from "../mockCollegeData";
import NeedsRecruitmentList from "../components/NeedsRecruitmentList";
import { mockNeedsRecruitment } from "../mockCollegeData";



export default function CollegeManagement() {
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
        rankings
    } = useCollegeManagement();



    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">College Management</h1>
            <p className="text-gray-500 mb-6">
                Approve institutions, monitor placement performance
            </p>
            {/* Search + Filters */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search college..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded cursor-pointer"
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
                    className="border p-2 rounded"
                />
            </div>
            <div className="mt-6">
                <p className="font-semibold mb-3">
                    Showing {filteredColleges.length} colleges
                </p>
                <CollegeTable colleges={currentColleges} />
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(
                            prev => prev - 1
                        )}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded cursor-pointer"
                    >
                        Prev
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(
                            prev => prev + 1
                        )}
                        disabled={
                            currentPage === totalPages
                        }
                        className="px-4 py-2 border rounded cursor-pointer"
                    >
                        Next
                    </button>
                </div>
                <NeedsRecruitmentList
                    colleges={mockNeedsRecruitment}
                />
                {/* Use this when backend is prepared
                <NeedsRecruitmentList
                    colleges={needsRecruitment}
                /> */}
                <CollegeRankingTable
                    rankings={mockRankings}
                />
                {/* Use when backend is ready
                <CollegeRankingTable
                    rankings={rankings}
                /> */}
            </div>
        </div>
    );
}
