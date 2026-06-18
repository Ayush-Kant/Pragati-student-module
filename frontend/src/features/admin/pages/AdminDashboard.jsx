import { useOutletContext } from "react-router-dom";
import useAdminDashboard from "../hooks/useAdminDashboard";

import AdminStatsRow from "../components/AdminStatsRow";
import ConversionFunnelChart from "../components/ConversionFunnelChart";
import CompanyStatsTable from "../components/CompanyStatsTable";
import CollegePerformanceTable from "../components/CollegePerformanceTable";
import ActivityFeed from "../components/ActivityFeed";

const AdminDashboard = () => {
    const { darkMode } = useOutletContext();

    const {
        stats,
        funnel,
        companies,
        colleges,
        activities,
        loading,
        error,
    } = useAdminDashboard();

    if (loading) {
        return (
            <div
                className={`p-4 sm:p-6 space-y-6 min-h-screen ${
                    darkMode
                        ? "bg-slate-900 text-white"
                        : "bg-gray-50 text-gray-900"
                }`}
            >
                <div className="space-y-2">
                    <div className="h-8 w-60 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-96 bg-gray-300 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 bg-gray-300 rounded-2xl animate-pulse"
                        ></div>
                    ))}
                </div>

                <div className="h-80 bg-gray-300 rounded-2xl animate-pulse"></div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="h-96 bg-gray-300 rounded-2xl animate-pulse"></div>
                    <div className="h-96 bg-gray-300 rounded-2xl animate-pulse"></div>
                </div>

                <div className="h-72 bg-gray-300 rounded-2xl animate-pulse"></div>
            </div>
        );
    }

    return (
        <div
            className={`p-4 sm:p-6 min-h-screen space-y-6 transition-all duration-300 ${
                darkMode
                    ? "bg-slate-900 text-white"
                    : "bg-gray-50 text-gray-900"
            }`}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1
                        className={`text-2xl sm:text-3xl font-bold ${
                            darkMode ? "text-white" : "text-gray-800"
                        }`}
                    >
                        Admin Dashboard
                    </h1>

                    <p
                        className={`text-sm mt-1 ${
                            darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                        }`}
                    >
                        Monitor drives, hiring activity, college performance,
                        and admin actions.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Stats */}
            <AdminStatsRow stats={stats} darkMode={darkMode} />

            {/* Funnel */}
            <div
                className={`rounded-2xl shadow-sm p-5 ${
                    darkMode
                        ? "bg-slate-800 border border-slate-700"
                        : "bg-white border border-gray-100"
                }`}
            >
                <h2
                    className={`text-lg font-semibold mb-5 ${
                        darkMode
                            ? "text-white"
                            : "text-gray-800"
                    }`}
                >
                    Conversion Funnel
                </h2>

                <ConversionFunnelChart
                    funnel={funnel}
                    darkMode={darkMode}
                />
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div
                    className={`rounded-2xl shadow-sm p-5 overflow-x-auto ${
                        darkMode
                            ? "bg-slate-800 border border-slate-700"
                            : "bg-white border border-gray-100"
                    }`}
                >
                    <h2
                        className={`text-lg font-semibold mb-5 ${
                            darkMode
                                ? "text-white"
                                : "text-gray-800"
                        }`}
                    >
                        Company Hiring Statistics
                    </h2>

                    <CompanyStatsTable
                        companies={companies}
                        darkMode={darkMode}
                    />
                </div>

                <div
                    className={`rounded-2xl shadow-sm p-5 overflow-x-auto ${
                        darkMode
                            ? "bg-slate-800 border border-slate-700"
                            : "bg-white border border-gray-100"
                    }`}
                >
                    <h2
                        className={`text-lg font-semibold mb-5 ${
                            darkMode
                                ? "text-white"
                                : "text-gray-800"
                        }`}
                    >
                        College Performance Rankings
                    </h2>

                    <CollegePerformanceTable
                        colleges={colleges}
                        darkMode={darkMode}
                    />
                </div>
            </div>

            {/* Activity Feed */}
            <div
                className={`rounded-2xl shadow-sm p-5 ${
                    darkMode
                        ? "bg-slate-800 border border-slate-700"
                        : "bg-white border border-gray-100"
                }`}
            >
                <h2
                    className={`text-lg font-semibold mb-5 ${
                        darkMode
                            ? "text-white"
                            : "text-gray-800"
                    }`}
                >
                    Recent Activity
                </h2>

                <ActivityFeed
                    activities={activities}
                    darkMode={darkMode}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;