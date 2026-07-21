import {
    Clock,
    Link as LinkIcon,
    Pencil,
    Trash2,
} from "lucide-react";

const ModuleCard = ({
    module,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        #{module?.order}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit?.(module)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => onDelete?.(module.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {module?.title}
            </h3>

            {/* Content URL */}
            <div className="flex items-center gap-2 text-slate-600 text-sm mb-3 break-all">
                <LinkIcon size={16} />
                <a
                    href={module?.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 hover:underline"
                >
                    {module?.contentUrl}
                </a>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Clock size={16} />
                <span>
                    {module?.durationHours} Hours
                </span>
            </div>
        </div>
    );
};

export default ModuleCard;