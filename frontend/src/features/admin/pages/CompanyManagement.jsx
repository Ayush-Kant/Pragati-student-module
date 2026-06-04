import { useOutletContext } from "react-router-dom";
import useCompanyManagement from "../hooks/useCompanyManagement";
import CompanyTable from "../components/CompanyTable";
import CompanyFilterBar from "../components/CompanyFilterBar";
import { updateCompanyStatus } from "../services/companyService";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyManagement() {
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const { darkMode } = useOutletContext();
    const navigate = useNavigate();
    const {
        loading,
        filteredCompanies,
        currentCompanies,
        currentPage,
        setCurrentPage,
        totalPages,
        search,
        setSearch,
        industry,
        setIndustry,
        location,
        setLocation,
        status,
        setStatus,
        fetchCompanies,
    } = useCompanyManagement();

    const handleStatusChange = async (
        companyId,
        newStatus
    ) => {
        try {
            setActionLoading(true);
            setError(null);
            await updateCompanyStatus(
                companyId,
                {
                    status: newStatus,
                    reason: "",
                }
            );
            fetchCompanies();
            toast.success(
                `Company ${newStatus} successfully`
            );
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error.message || "Failed to update company status";
            setError(errorMsg);
            console.error("STATUS ERROR:", error);
            toast.error(errorMsg);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className={`p-4 transition ${darkMode ? "text-white" : "text-slate-900"}`}>
            <h1 className="text-2xl font-bold mb-2">
                Company Management
            </h1>
            <p className={`mb-6 ${darkMode ? "text-slate-300" : "text-gray-500"}`}>
                Manage companies and monitor engagement.
            </p>

            <div className="flex gap-3 mt-4 mb-6 flex-wrap">
                <button
                    onClick={() =>
                        navigate("/admin/companies/active-drives")
                    }
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition"
                >
                    Active Drives
                </button>

                <button
                    onClick={() =>
                        navigate("/admin/companies/rankings")
                    }
                    className="px-4 py-2 bg-[#4AB8A8] text-white rounded-lg cursor-pointer hover:bg-[#3a9b92] transition"
                >
                    Rankings
                </button>
            </div>

            {error && (
                <div className={`mb-4 p-4 rounded-lg border ${darkMode ? "bg-red-950 border-red-700 text-red-200" : "bg-red-50 border-red-200 text-red-700"}`}>
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className={`rounded-lg p-6 ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white"}`}>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`animate-pulse h-12 rounded ${darkMode ? "bg-slate-800" : "bg-gray-200"}`}></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <>
                        <CompanyFilterBar
                            search={search}
                            setSearch={setSearch}
                            industry={industry}
                            setIndustry={setIndustry}
                            location={location}
                            setLocation={setLocation}
                            status={status}
                            setStatus={setStatus}
                            darkMode={darkMode}
                        />
                        <p className="font-semibold mb-4">
                            Showing {filteredCompanies.length} companies
                        </p>
                        {
                            filteredCompanies.length === 0 ? (
                                <div
                                    className={`mt-6 p-12 rounded-lg text-center ${darkMode
                                        ? "bg-slate-950 border border-slate-700"
                                        : "bg-white border border-slate-200"
                                        }`}
                                >
                                    <div className="text-4xl mb-3">🏢</div>
                                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>No Companies Found</h3>
                                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                        {search || industry || location || status !== "all" 
                                            ? "Try adjusting your filters" 
                                            : "Start by adding a new company"}
                                    </p>
                                </div>
                            ) : (
                                <CompanyTable
                                    companies={currentCompanies}
                                    darkMode={darkMode}
                                    onStatusChange={handleStatusChange}
                                    actionLoading={actionLoading}
                                />
                            )
                        }
                        {
                            filteredCompanies.length > 0 && (
                                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) => prev - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 border rounded transition ${darkMode ? "bg-slate-900 border-slate-700 hover:bg-slate-800 disabled:opacity-50" : "bg-white border-slate-300 hover:bg-slate-50 disabled:opacity-50"} disabled:cursor-not-allowed`}
                                    >
                                        ← Prev
                                    </button>

                                    <span className="flex items-center px-4">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) => prev + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 border rounded transition ${darkMode ? "bg-slate-900 border-slate-700 hover:bg-slate-800 disabled:opacity-50" : "bg-white border-slate-300 hover:bg-slate-50 disabled:opacity-50"} disabled:cursor-not-allowed`}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )
                        }
                    </>
                </div>
            )}
        </div>
    );
}