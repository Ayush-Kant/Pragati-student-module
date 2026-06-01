import { useOutletContext } from "react-router-dom";
import useCompanyManagement from "../hooks/useCompanyManagement";
import CompanyTable from "../components/CompanyTable";
import CompanyFilterBar from "../components/CompanyFilterBar";
import { updateCompanyStatus } from "../services/companyService";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CompanyManagement() {
    const [actionLoading, setActionLoading] = useState(false);
    const { darkMode } = useOutletContext();
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
            await updateCompanyStatus(
                companyId,
                newStatus
            );
            fetchCompanies();
            toast.success(
                `Company ${newStatus} successfully`
            );
        } catch (error) {
            toast.error("Something went wrong");
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
            {loading ? (
                <p>Loading companies...</p>
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
                                    className={`mt-6 p-8 rounded-lg text-center ${darkMode
                                        ? "bg-slate-950 border border-slate-700"
                                        : "bg-white"
                                        }`}
                                >
                                    No companies found.
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
                                <div className="flex justify-center gap-4 mt-6">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) => prev - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded cursor-pointer disabled:opacity-50"
                                    >
                                        Prev
                                    </button>

                                    <span className="flex items-center">
                                        {currentPage} / {totalPages}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) => prev + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border rounded cursor-pointer disabled:opacity-50"
                                    >
                                        Next
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