import { getDifficultyClasses } from '../../utils/codingChallengeHelpers';

/**
 * Badge displaying a challenge difficulty level.
 *
 * @param {{ difficulty: string }} props
 */
const DifficultyBadge = ({ difficulty }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-lg ${getDifficultyClasses(difficulty)}`}
  >
    {difficulty}
  </span>
);

export default DifficultyBadge;
