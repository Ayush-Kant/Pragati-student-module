const ProgramStatusBadge = ({ status }) => {
    const statusStyles = {
        active: "bg-green-100 text-green-700",
        archived: "bg-gray-200 text-gray-700",
        draft: "bg-yellow-100 text-yellow-700",
        inactive: "bg-red-100 text-red-700",
    };

    const normalizedStatus = status?.toLowerCase();

    return (
        <div
            className={`px-4 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${statusStyles[normalizedStatus] ||
                "bg-slate-100 text-slate-700"
                }`}
        >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {status || "Unknown"}
        </div>
    );
};

export default ProgramStatusBadge;