import { useOutletContext } from "react-router-dom";
import useCompanyRankings from "../hooks/useCompanyRankings";
import RankingsTable from "../components/RankingsTable";

export default function CompanyRankings() {
    const { darkMode } = useOutletContext();

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
                    className={`rounded-lg p-6 animate-pulse ${darkMode
                            ? "bg-slate-950 border border-slate-700"
                            : "bg-white"
                        }`}
                >
                    <div className="space-y-4">
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ) : (
                <RankingsTable
                    rankings={rankings}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
}