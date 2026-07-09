import { formatDate } from "../../utils/assignmentHelpers";
import { MessageSquare}  from "lucide-react";
const FeedbackCard = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="text-base font-bold text-gray-800">Instructor Feedback</h3>
        </div>
        {feedback.date && (
          <span className="text-xs text-gray-400">{formatDate(feedback.date)}</span>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{feedback.comment}</p>

      {feedback.instructorName && (
        <p className="text-xs text-gray-400 mt-3 italic">— {feedback.instructorName}</p>
      )}
    </div>
  );
};

export default FeedbackCard;
