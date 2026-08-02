import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getActiveDrives } from "../services/companyService";
import ActiveDrivesTable from "../components/ActiveDrivesTable";
import { useNavigate } from "react-router-dom";

export default function ActiveDrives() {
    const { darkMode } = useOutletContext();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const data =
                    await getActiveDrives();
                setDrives(data.companies);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrives();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div
            className={`p-4 ${darkMode
                ? "text-white"
                : "text-slate-900"
                }`}
        >
            <h1 className="text-2xl font-bold mb-2">
                Active Drive Participants
            </h1>


            <p className="mb-6 text-gray-500">
                Companies participating in
                active recruitment drives.
            </p>
            <p className="font-medium mb-4">
                Showing {drives.length} active drives
            </p>
            {
                drives.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        No active drives found.
                    </div>
                ) : (

                    <ActiveDrivesTable drives={drives} darkMode={darkMode} />
                )
            }
            <button
                onClick={() => navigate("/admin/companies")}
                className="mt-4 px-4 py-2 border rounded-lg bg-orange-400 text-white cursor-pointer"
            >
                ← Back to Companies
            </button>
        </div>
    );
}