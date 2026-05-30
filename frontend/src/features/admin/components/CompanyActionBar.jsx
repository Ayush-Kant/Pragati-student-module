import { useNavigate } from "react-router-dom";

export default function CompanyActionBar({ company }) {
    const status = company.status?.toLowerCase();
    const navigate = useNavigate();

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                onClick={() =>
                    navigate(`/admin/companies/${company.id}`)
                }
                className="px-2 py-1 text-sm rounded border cursor-pointer"
            >
                View
            </button>
            {status === "pending" && (
                <>
                    <button
                        onClick={() => console.log("Approve", company.name)}
                        className="px-2 py-1 text-sm rounded bg-green-100 text-green-700 cursor-pointer"
                    >
                        Approve
                    </button>

                    <button
                        onClick={() => console.log("Reject", company.name)}
                        className="px-2 py-1 text-sm rounded bg-red-100 text-red-700 cursor-pointer"
                    >
                        Reject
                    </button>
                </>
            )}

            {status === "approved" && (
                <button
                    onClick={() => console.log("Suspend", company.name)}
                    className="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-700 cursor-pointer"
                >
                    Suspend
                </button>
            )}

            {status === "suspended" && (
                <button
                    onClick={() => console.log("Reinstate", company.name)}
                    className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700 cursor-pointer"
                >
                    Reinstate
                </button>
            )}


        </div>
    );
}