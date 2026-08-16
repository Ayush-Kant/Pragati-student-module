import { formatDate } from "../../utils/assignmentHelpers";
import { MessageSquare, UserCheck } from "lucide-react";

const FeedbackCard = ({ feedback, darkMode = false }) => {
  if (!feedback) return null;

  return (
    <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className={`text-base font-semibold ${darkMode ? "text-slate-200" : "text-gray-900"}`}>
            Instructor Feedback
          </h3>
        </div>
        {feedback.date && (
          <span className={`text-xs font-medium ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
            {formatDate(feedback.date)}
          </span>
        )}
      </div>

      {/* Comment */}
      <div className={`border rounded-xl px-4 py-3.5 mb-4 ${darkMode ? "bg-blue-900/10 border-blue-800" : "bg-blue-50/50 border-blue-100"}`}>
        <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
          {feedback.comment}
        </p>
      </div>

      {/* Instructor attribution */}
      {feedback.instructorName && (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${darkMode ? "bg-slate-700" : "bg-gray-100"}`}>
            <UserCheck className={`w-3.5 h-3.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
          </div>
          <span className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            {feedback.instructorName}
          </span>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
