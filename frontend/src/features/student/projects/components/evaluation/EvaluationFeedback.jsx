import { MessageCircle, Lightbulb } from 'lucide-react';

/**
 * Overall feedback and improvement suggestions section.
 * @param {{ evaluation: object }} props
 */
const EvaluationFeedback = ({ evaluation }) => (
  <div className="space-y-6">
    {/* Overall feedback */}
    {evaluation.overallFeedback && (
      <div className="bg-teal-500/8 border border-teal-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={16} className="text-teal-400" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-teal-300">Overall Feedback</h4>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {evaluation.overallFeedback}
        </p>
      </div>
    )}

    {/* Suggestions */}
    {evaluation.suggestions?.length > 0 && (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-yellow-400" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-gray-200">Improvement Suggestions</h4>
        </div>
        <ul className="space-y-2">
          {evaluation.suggestions.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs text-yellow-400 font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default EvaluationFeedback;
