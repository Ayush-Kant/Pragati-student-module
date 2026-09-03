import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

const ChallengeConstraints = memo(({ constraints }) => {
  if (!constraints?.length) return null;

  return (
    <section aria-labelledby="constraints-heading">
      <h2 id="constraints-heading" className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900">
        <AlertCircle size={15} className="text-blue-600" />
        Constraints
      </h2>
      <ul className="space-y-2" aria-label="Challenge constraints">
        {constraints.map((constraint, idx) => (
          <li key={idx} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
            <code className="font-mono text-[13px]">{constraint}</code>
          </li>
        ))}
      </ul>
    </section>
  );
});

ChallengeConstraints.displayName = 'ChallengeConstraints';
export default ChallengeConstraints;
