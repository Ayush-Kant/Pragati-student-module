import {
    BookOpen,
    Users,
    GraduationCap,
    UserCircle,
} from "lucide-react";
import ProgramStatusBadge from "./ProgramStatusBadge";

const ProgramCard = ({
    program,
    onEdit,
    onManage,
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">
                        {program?.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                        {program?.targetRole}
                    </p>
                </div>

                <ProgramStatusBadge status={program?.status} />
            </div>

            {/* Mentor */}
            <div className="flex items-center gap-2 text-slate-700 mb-4">
                <UserCircle size={18} />
                <span className="text-sm">
                    Mentor: {program?.mentor?.name || "Not Assigned"}
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">

                <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <BookOpen
                        size={18}
                        className="mx-auto mb-1 text-blue-600"
                    />

                    <p className="text-lg font-bold text-slate-900">
                        {program?.modulesCount || 0}
                    </p>

                    <p className="text-xs text-slate-500">
                        Modules
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <Users
                        size={18}
                        className="mx-auto mb-1 text-green-600"
                    />

                    <p className="text-lg font-bold text-slate-900">
                        {program?.enrollment || 0}
                    </p>

                    <p className="text-xs text-slate-500">
                        Enrolled
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <GraduationCap
                        size={18}
                        className="mx-auto mb-1 text-purple-600"
                    />

                    <p className="text-lg font-bold text-slate-900">
                        {program?.completionRate || "0%"}
                    </p>

                    <p className="text-xs text-slate-500">
                        Completion
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => onEdit?.(program)}
                    className="flex-1 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
                >
                    Edit
                </button>

                <button
                    onClick={() => onManage?.(program)}
                    className="flex-1 px-4 py-2 rounded-full bg-slate-700 text-white text-sm font-medium hover:bg-slate-800 transition cursor-pointer"
                >
                    Manage
                </button>
            </div>
        </div>
    );
};

export default ProgramCard;