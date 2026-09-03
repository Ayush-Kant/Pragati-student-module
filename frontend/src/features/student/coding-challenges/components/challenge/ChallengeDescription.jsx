import { memo, useMemo, useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const ChallengeDescription = memo(({ challenge }) => {
  const [showHints, setShowHints] = useState(false);
  const description = challenge.description || challenge.problemStatement || 'No problem statement is available for this challenge.';
  const examples = useMemo(() => {
    if (Array.isArray(challenge.examples) && challenge.examples.length) return challenge.examples;
    if (challenge.sampleInput || challenge.sampleOutput) {
      return [{ id: 'sample', input: challenge.sampleInput ?? '—', output: challenge.sampleOutput ?? '—' }];
    }
    return [];
  }, [challenge.examples, challenge.sampleInput, challenge.sampleOutput]);
  const hints = Array.isArray(challenge.hints) ? challenge.hints : [];

  return (
    <div className="space-y-7">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Problem</h2>
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{description}</p>
      </section>

      {examples.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-slate-900">Examples</h2>
          <div className="space-y-3">
            {examples.map((ex, idx) => (
              <div key={ex.id ?? idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Example {idx + 1}</p>
                <div className="space-y-2 font-mono text-[13px]">
                  <div><span className="text-slate-500">Input: </span><span className="break-all text-slate-800">{ex.input}</span></div>
                  <div><span className="text-slate-500">Output: </span><span className="break-all font-semibold text-emerald-700">{ex.output}</span></div>
                  {ex.explanation && <div className="font-sans leading-6"><span className="font-medium text-slate-500">Explanation: </span><span className="text-slate-700">{ex.explanation}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {challenge.constraints?.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-bold text-slate-900">Constraints</h2>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {challenge.constraints.map((constraint, idx) => <li key={idx} className="rounded-lg bg-slate-50 px-3 py-2">{constraint}</li>)}
          </ul>
        </section>
      )}

      {hints.length > 0 && (
        <section>
          <button type="button" onClick={() => setShowHints((prev) => !prev)} className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800" aria-expanded={showHints}>
            <Lightbulb size={15} /> {showHints ? 'Hide hints' : `Show hints (${hints.length})`} {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showHints && <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">{hints.map((hint, idx) => <li key={idx}>{hint}</li>)}</ol>}
        </section>
      )}
    </div>
  );
});

ChallengeDescription.displayName = 'ChallengeDescription';
export default ChallengeDescription;
