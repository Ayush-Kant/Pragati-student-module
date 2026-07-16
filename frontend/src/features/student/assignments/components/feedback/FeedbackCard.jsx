import { formatDate } from "../../utils/assignmentHelpers";
import { MessageSquare, UserCheck } from "lucide-react";

const FeedbackCard = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Instructor Feedback
          </h3>
        </div>
        {feedback.date && (
          <span className="text-xs text-gray-400 font-medium">
            {formatDate(feedback.date)}
          </span>
        )}
      </div>

      {/* Comment */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3.5 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {feedback.comment}
        </p>
      </div>

      {/* Instructor attribution */}
      {feedback.instructorName && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <UserCheck className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="text-xs font-medium text-gray-500">
            {feedback.instructorName}
          </span>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
