import React from "react";

const StudentProgressTimeline = ({ currentStage }) => {
    const stages = [
        "applied",
        "tested",
        "training",
        "interview",
        "placed",
    ];

    const currentIndex = stages.indexOf(currentStage);

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">
                Drive Progress Timeline
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;

                    return (
                        <div
                            key={stage}
                            className="flex items-center md:flex-col md:flex-1"
                        >
                            {/* Circle */}
                            <div
                                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-full text-white font-bold
                  ${isCompleted
                                        ? "bg-green-500"
                                        : isActive
                                            ? "bg-blue-500"
                                            : "bg-gray-400"
                                    }
                `}
                            >
                                {isCompleted ? "✓" : isActive ? "●" : "○"}
                            </div>

                            {/* Stage Name */}
                            <span
                                className={`
                  ml-3 md:ml-0 md:mt-2 text-sm font-medium capitalize
                  ${isCompleted
                                        ? "text-green-600"
                                        : isActive
                                            ? "text-blue-600"
                                            : "text-gray-500"
                                    }
                `}
                            >
                                {stage}
                            </span>

                            {/* Connector Line */}
                            {index !== stages.length - 1 && (
                                <div
                                    className={`
                    hidden md:block
                    h-1 flex-1 mx-2 mt-[-24px]
                    ${index < currentIndex
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                        }
                  `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentProgressTimeline;