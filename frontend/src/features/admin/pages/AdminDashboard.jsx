import useAdminDashboard from "../hooks/useAdminDashboard";

import AdminStatsRow from "../components/AdminStatsRow";
import ConversionFunnelChart from "../components/ConversionFunnelChart";
import CompanyStatsTable from "../components/CompanyStatsTable";
import CollegePerformanceTable from "../components/CollegePerformanceTable";
import ActivityFeed from "../components/ActivityFeed";

const AdminDashboard = () => {
    const {
        stats,
        funnel,
        companies,
        colleges,
        activities,
        loading,
        error,
    } = useAdminDashboard();

    // Loading State
    if (loading) {
        return (
            <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">

                {/* Header Skeleton */}
                <div className="space-y-2">
                    <div className="h-8 w-60 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 bg-gray-200 rounded-2xl animate-pulse"
                        ></div>
                    ))}
                </div>

                {/* Chart Skeleton */}
                <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>

                {/* Table Skeletons */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                    <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>

                {/* Activity Feed Skeleton */}
                <div className="h-72 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor drives, hiring activity, college performance, and admin actions.
                    </p>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* KPI Stats Row */}
            <AdminStatsRow stats={stats} />

            {/* Funnel Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Conversion Funnel
                </h2>
                <ConversionFunnelChart funnel={funnel} />
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Company Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-x-auto">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Company Hiring Statistics
                    </h2>
                    <CompanyStatsTable companies={companies} />
                </div>

                {/* College Performance */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-x-auto">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        College Performance Rankings
                    </h2>
                    <CollegePerformanceTable colleges={colleges} />
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Recent Activity
                </h2>
                <ActivityFeed activities={activities} />
            </div>
        </div>
    );
};

export default AdminDashboard;