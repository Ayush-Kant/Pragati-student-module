import { formatDistanceToNow } from "date-fns";
import {
    CheckCircle2,
    XCircle,
    Lock,
    Rocket,
    Settings,
    Bell,
} from "lucide-react";

const ActivityFeed = ({ activities }) => {

    // Safety Check
    const safeActivities = Array.isArray(activities)
        ? activities
        : [];

    // Empty State
    if (safeActivities.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
                No recent activity
            </div>
        );
    }

    // Action Icon Mapping
    const activityIcons = {
        verified_mentor: (
            <CheckCircle2 size={18} className="text-green-600" />
        ),
        rejected_mentor: (
            <XCircle size={18} className="text-red-600" />
        ),
        closed_drive: (
            <Lock size={18} className="text-gray-600" />
        ),
        created_drive: (
            <Rocket size={18} className="text-blue-600" />
        ),
        updated_settings: (
            <Settings size={18} className="text-yellow-600" />
        ),
        default: (
            <Bell size={18} className="text-gray-500" />
        ),
    };

    // Action Text Mapping
    const getActionText = (activity) => {
        const performer = activity?.performedBy || "Someone";
        switch (activity?.action) {
            case "verified_mentor":
                return `${performer} verified a mentor`;
            case "rejected_mentor":
                return `${performer} rejected a mentor`;
            case "closed_drive":
                return `${performer} closed a drive`;
            case "created_drive":
                return `${performer} created a drive`;
            case "updated_settings":
                return `${performer} updated platform settings`;
            default:
                return `${performer} performed an admin action`;
        }
    };

    return (
        <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4">
            {safeActivities.slice(0, 10).map((activity, index) => {
                // Safe Date Parsing
                const activityDate = activity?.createdAt
                    ? new Date(activity.createdAt)
                    : null;
                const relativeTime = activityDate && !isNaN(activityDate)
                    ? formatDistanceToNow(activityDate, { addSuffix: true })
                    : "Unknown time";
                return (
                    <div
                        key={activity?.logId || index}
                        className="
              flex items-start gap-4
              p-4
              rounded-2xl
              border border-gray-100
              hover:bg-gray-50
              transition-colors
              duration-200
            "
                    >

                        {/* Icon */}
                        <div className="
              w-11 h-11
              flex items-center justify-center
              rounded-full
              bg-gray-100
              text-xl
              shrink-0
            ">
                            {activityIcons[activity.action] || activityIcons.default}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Description */}
                            <p className="text-sm sm:text-base text-gray-800 font-medium break-words">
                                {getActionText(activity)}
                            </p>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                <span>
                                    {activity?.targetType || "Unknown"}
                                </span>
                                <span>•</span>
                                <span>
                                    ID: {activity?.targetId || "N/A"}
                                </span>
                            </div>

                            {/* Relative Time */}
                            <p className="text-xs text-gray-400 mt-2">
                                {relativeTime}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityFeed;