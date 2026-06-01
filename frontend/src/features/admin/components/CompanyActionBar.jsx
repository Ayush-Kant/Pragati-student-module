import { useNavigate } from "react-router-dom";

export default function CompanyActionBar({ company, onStatusChange, actionLoading, showViewButton}) {
    const status = company.status?.toLowerCase();
    const navigate = useNavigate();

    return (
        <div className="flex gap-2 flex-wrap">
            {
                showViewButton && (
                    <button
                        onClick={() =>
                            navigate(`/admin/companies/${company.id}`)
                        }
                        className="px-2 py-1 text-sm rounded border cursor-pointer"
                    >
                        View
                    </button>
                )
            }
            {status === "pending" && (
                <>
                    <button
                        onClick={() =>
                            onStatusChange(company.id, "approved")
                        }
                        className="px-2 py-1 text-sm rounded bg-green-100 text-green-700"
                    >
                        {actionLoading ? "Loading..." : "Approve"}
                    </button>

                    <button
                        onClick={() =>
                            onStatusChange(company.id, "rejected")
                        }
                        className="px-2 py-1 text-sm rounded bg-red-100 text-red-700"
                    >
                        {actionLoading ? "Loading..." : "Reject"}
                    </button>
                </>
            )}

            {status === "approved" && (
                <button
                    onClick={() =>
                        onStatusChange(company.id, "suspended")
                    }
                    className="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-700"
                >
                    {actionLoading ? "Loading..." : "Suspend"}
                </button>
            )}

            {status === "suspended" && (
                <button
                    onClick={() =>
                        onStatusChange(company.id, "approved")
                    }
                    className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700"
                >
                    {actionLoading ? "Loading..." : "Reinstate"}
                </button>
            )}
        </div>
    );
}