import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Renders the challenge constraints list.
 *
 * @param {{ constraints: string[] }} props
 */
const ChallengeConstraints = memo(({ constraints }) => {
  if (!constraints?.length) return null;

  return (
    <section aria-labelledby="constraints-heading">
      <h2
        id="constraints-heading"
        className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3"
      >
        <AlertCircle size={15} className="text-orange-400" aria-hidden="true" />
        Constraints
      </h2>
      <ul className="space-y-2" aria-label="Challenge constraints">
        {constraints.map((constraint, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
            <span
              className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-orange-500"
              aria-hidden="true"
            />
            <code className="font-mono text-xs leading-relaxed text-gray-200">{constraint}</code>
          </li>
        ))}
      </ul>
    </section>
  );
});

ChallengeConstraints.displayName = 'ChallengeConstraints';

export default ChallengeConstraints;
