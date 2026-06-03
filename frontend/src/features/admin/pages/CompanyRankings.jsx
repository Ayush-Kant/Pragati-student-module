import { useNavigate, useOutletContext } from "react-router-dom";
import useCompanyRankings from "../hooks/useCompanyRankings";
import RankingsTable from "../components/RankingsTable";

export default function CompanyRankings() {
    const { darkMode } = useOutletContext();
    const navigate = useNavigate()

    const {
        rankings,
        loading,
    } = useCompanyRankings();

    return (
        <div
            className={`p-4 transition ${darkMode
                ? "text-white"
                : "text-slate-900"
                }`}
        >
            <h1 className="text-2xl font-bold mb-2">
                Company Rankings
            </h1>

            <p
                className={`mb-6 ${darkMode
                    ? "text-slate-300"
                    : "text-gray-500"
                    }`}
            >
                View company performance rankings and hiring metrics.
            </p>

            {loading ? (
                <div
                    className={`rounded-lg p-6 ${darkMode
                        ? "bg-slate-950 border border-slate-700"
                        : "bg-white"
                        }`}
                >
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`animate-pulse h-12 rounded ${darkMode ? "bg-slate-800" : "bg-gray-200"}`}></div>
                        ))}
                    </div>
                </div>
            ) : rankings && rankings.length > 0 ? (
                <RankingsTable
                    rankings={rankings}
                    darkMode={darkMode}
                />
            ) : (
                <div
                    className={`rounded-lg p-12 transition text-center ${darkMode
                        ? "bg-slate-950 border border-slate-700"
                        : "bg-white border border-slate-200"
                        }`}
                >
                    <div className="text-4xl mb-3">📊</div>
                    <h2 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                        No Rankings Available
                    </h2>
                    <p className={`${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                        Rankings will appear once companies start their hiring drives.
                    </p>
                </div>
            )}
            <button
                onClick={() => navigate("/admin/companies")}
                className={`mt-4 px-4 py-2 border rounded-lg cursor-pointer transition ${darkMode ? "bg-orange-500 border-orange-500 text-white hover:bg-orange-400" : "bg-orange-400 border-orange-400 text-white hover:bg-orange-500"}`}
            >
                ← Back to Companies
            </button>
        </div>
    );
}