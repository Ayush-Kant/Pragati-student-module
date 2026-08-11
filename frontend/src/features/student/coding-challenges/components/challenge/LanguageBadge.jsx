import { getLanguageLabel } from '../../utils/codingChallengeHelpers';

/**
 * Badge displaying a programming language.
 *
 * @param {{ language: string }} props
 */
const LanguageBadge = ({ language }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/40 text-gray-300 border border-gray-700/60">
    {getLanguageLabel(language)}
  </span>
);

export default LanguageBadge;
