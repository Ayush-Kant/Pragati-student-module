export default function CompanyFilterBar({
    search,
    setSearch,
    industry,
    setIndustry,
    location,
    setLocation,
    status,
    setStatus,
    darkMode,
}) {
    return (
        <div
            className={`p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 mb-6 ${darkMode
                    ? "bg-slate-950 border border-slate-700"
                    : "bg-white"
                }`}
        >
            {/* Search */}
            <input
                type="text"
                placeholder="Search company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded border px-3 py-2 ${darkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300"
                    }`}
            />

            {/* Industry */}
            <input
                type="text"
                placeholder="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className={`rounded border px-3 py-2 ${darkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300"
                    }`}
            />

            {/* Location */}
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`rounded border px-3 py-2 ${darkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300"
                    }`}
            />

            {/* Status */}
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`rounded border px-3 py-2 ${darkMode
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-white border-slate-300 cursor-pointer"
                    }`}
            >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    );
}