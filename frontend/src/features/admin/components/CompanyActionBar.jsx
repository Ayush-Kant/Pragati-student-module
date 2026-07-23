import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ApproveModal from "./modals/ApproveModal";
import RejectModal from "./modals/RejectModal";
import SuspendModal from "./modals/SuspendModal";
import ReinstateModal from "./modals/ReinstateModal";

export default function CompanyActionBar({ company, onStatusChange, actionLoading, showViewButton, darkMode = false }) {
    const status = company.status?.toLowerCase();
    const navigate = useNavigate();
    const [modalType, setModalType] = useState(null);

    return (
        <div className="flex gap-2 flex-wrap">
            {
                showViewButton && (
                    <button
                        onClick={() =>
                            navigate(`/admin/companies/${company.id}`)
                        }
                        className={`px-2 py-1 text-sm rounded border transition ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 cursor-pointer"}`}
                    >
                        View
                    </button>
                )
            }
            {status === "pending" && (
                <>
                    <button
                        onClick={() => setModalType("approve")}
                        disabled={actionLoading}
                        className={`px-2 py-1 text-sm rounded transition ${darkMode ? "bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed" : "bg-green-100 text-green-700 hover:bg-green-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}`}
                    >
                        {actionLoading ? "Loading..." : "Approve"}
                    </button>

                    <button
                        onClick={() => setModalType("reject")}
                        disabled={actionLoading}
                        className={`px-2 py-1 text-sm rounded transition ${darkMode ? "bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed" : "bg-red-100 text-red-700 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}`}
                    >
                        {actionLoading ? "Loading..." : "Reject"}
                    </button>
                </>
            )}

            {status === "approved" && (
                <button
                    onClick={() => setModalType("suspend")}
                    disabled={actionLoading}
                    className={`px-2 py-1 text-sm rounded transition ${darkMode ? "bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}`}
                >
                    {actionLoading ? "Loading..." : "Suspend"}
                </button>
            )}

            {status === "suspended" && (
                <button
                    onClick={() => setModalType("reinstate")}
                    disabled={actionLoading}
                    className={`px-2 py-1 text-sm rounded transition ${darkMode ? "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" : "bg-blue-100 text-blue-700 hover:bg-blue-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}`}
                >
                    {actionLoading ? "Loading..." : "Reinstate"}
                </button>
            )}

            <>
                <ApproveModal
                    isOpen={modalType === "approve"}
                    company={company}
                    onClose={() => setModalType(null)}
                    // onConfirm={() => {
                    //     onStatusChange(company.id, "approved");
                    //     setModalType(null);
                    // }}
                    onConfirm={() => {
                        console.log("Company object:", company);
                        console.log("Company ID:", company.id);

                        onStatusChange(company.id, "approved");
                        setModalType(null);
                    }}
                />

                <RejectModal
                    isOpen={modalType === "reject"}
                    company={company}
                    onClose={() => setModalType(null)}
                    onConfirm={(reason) => {
                        onStatusChange(
                            company.id,
                            "Rejected",
                            reason
                        );
                        setModalType(null);
                    }}
                />

                <SuspendModal
                    isOpen={modalType === "suspend"}
                    company={company}
                    onClose={() => setModalType(null)}
                    onConfirm={(reason) => {
                        onStatusChange(
                            company.id,
                            "Suspended",
                            reason
                        );
                        setModalType(null);
                    }}
                />

                <ReinstateModal
                    isOpen={modalType === "reinstate"}
                    company={company}
                    onClose={() => setModalType(null)}
                    onConfirm={() => {
                        onStatusChange(company.id, "approved");
                        setModalType(null);
                    }}
                />
            </>
        </div>
    );
}