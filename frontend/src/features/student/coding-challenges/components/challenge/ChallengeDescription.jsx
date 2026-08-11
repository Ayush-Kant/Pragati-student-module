import { memo, useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Renders the challenge problem description with examples and hints.
 * Markdown-style inline code is rendered with monospace styling.
 *
 * @param {{ challenge: object }} props
 */
const ChallengeDescription = memo(({ challenge }) => {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="space-y-5">
      {/* Description */}
      <section aria-labelledby="desc-heading">
        <h2 id="desc-heading" className="sr-only">Problem Description</h2>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          {challenge.description}
        </p>
      </section>

      {/* Examples */}
      {challenge.examples?.length > 0 && (
        <section aria-labelledby="examples-heading">
          <h2 id="examples-heading" className="text-sm font-semibold text-gray-100 mb-3">
            Examples
          </h2>
          <div className="space-y-3">
            {challenge.examples.map((ex, idx) => (
              <div
                key={ex.id}
                className="bg-gradient-to-br from-white/2 to-transparent border border-white/6 rounded-2xl p-4"
              >
                <p className="text-xs font-semibold text-gray-300 mb-2">
                  Example {idx + 1}
                </p>
                <div className="space-y-1.5 font-mono text-xs">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <span className="text-gray-100">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Output: </span>
                    <span className="text-teal-400 font-semibold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div>
                      <span className="text-gray-400">Explanation: </span>
                      <span className="text-gray-300 font-sans">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hints collapsible */}
      {challenge.hints?.length > 0 && (
        <section aria-labelledby="hints-heading">
          <button
            type="button"
            id="hints-heading"
            onClick={() => setShowHints((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
            aria-expanded={showHints}
          >
            <Lightbulb size={15} aria-hidden="true" />
            {showHints ? 'Hide Hints' : `Show Hints (${challenge.hints.length})`}
            {showHints ? (
              <ChevronUp size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </button>
          {showHints && (
            <ol className="mt-3 space-y-2 list-decimal list-inside" aria-label="Hints">
              {challenge.hints.map((hint, idx) => (
                <li key={idx} className="text-sm text-gray-400">
                  {hint}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  );
});

ChallengeDescription.displayName = 'ChallengeDescription';

export default ChallengeDescription;
