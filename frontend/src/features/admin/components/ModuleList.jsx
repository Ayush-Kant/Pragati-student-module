import ModuleCard from "./ModuleCard";
import { Plus } from "lucide-react";

const ModuleList = ({
    modules = [],
    onAddModule,
    onEditModule,
    onDeleteModule,
}) => {
    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                    Training Modules
                </h2>

                <button
                    onClick={onAddModule}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition cursor-pointer"
                >
                    <Plus size={16} />
                    Add Module
                </button>
            </div>

            {/* Empty State */}
            {modules.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
                    <p className="text-slate-500">
                        No modules added yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            onEdit={onEditModule}
                            onDelete={onDeleteModule}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModuleList;