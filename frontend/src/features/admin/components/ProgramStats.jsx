import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";

const ProgramStats = ({
    totalPrograms = 0,
    activePrograms = 0,
    avgCompletion = "0%",
}) => {
    const stats = [
        {
            id: 1,
            label: "Programs",
            value: totalPrograms,
            icon: BookOpen,
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            borderColor: "border-blue-300",
        },
        {
            id: 2,
            label: "Active",
            value: activePrograms,
            icon: CheckCircle,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            borderColor: "border-green-300",
        },
        {
            id: 3,
            label: "Avg Completion",
            value: avgCompletion,
            icon: TrendingUp,
            bgColor: "bg-purple-100",
            textColor: "text-purple-600",
            borderColor: "border-purple-300",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.id}
                    className={`
            ${stat.bgColor}
            ${stat.borderColor}
            border
            rounded-2xl
            p-5
            shadow-sm
            hover:shadow-md
            transition-all
            duration-300
          `}
                >
                    <div className="flex items-start justify-between mb-4">
                        <h3 className={`text-3xl font-bold ${stat.textColor}`}>
                            {stat.value}
                        </h3>

                        <div className={stat.textColor}>
                            <stat.icon size={30} />
                        </div>
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ProgramStats;