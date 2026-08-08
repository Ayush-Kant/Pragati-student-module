import { ArrowLeft, History, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import {
  formatAcceptanceRate,
  formatLargeNumber,
} from '../../utils/codingChallengeHelpers';

/**
 * Header section for the ChallengeDetailsPage.
 * Shows back button, title, difficulty, acceptance rate, and nav links.
 *
 * @param {{ challenge: object }} props
 */
const ChallengeHeader = ({ challenge }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-white/3 to-transparent border-b border-white/6 px-4 py-3 flex-shrink-0 backdrop-blur-sm">
      {/* Top row */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => navigate('/student/coding-challenges')}
          className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-orange-400 transition-colors"
          aria-label="Back to challenges list"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          All Challenges
        </button>

        <span className="text-gray-600" aria-hidden="true">/</span>

        <h1 className="text-sm font-bold text-gray-50 flex-1 min-w-0 truncate">
          {challenge.title}
        </h1>

        <DifficultyBadge difficulty={challenge.difficulty} />

        {/* Nav links */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() =>
              navigate(`/student/coding-challenges/${challenge.id}/submissions`)
            }
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/6 text-gray-300 hover:border-orange-400 hover:text-orange-300 transition-all duration-200"
          >
            <History size={13} aria-hidden="true" />
            History
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(`/student/coding-challenges/${challenge.id}/leaderboard`)
            }
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/6 text-gray-300 hover:border-orange-400 hover:text-orange-300 transition-all duration-200"
          >
            <Trophy size={13} aria-hidden="true" />
            Leaderboard
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <span>
          Acceptance:{' '}
          <span className="text-teal-400 font-medium">
            {formatAcceptanceRate(challenge.acceptanceRate)}
          </span>
        </span>
        <span>
          Submissions:{' '}
          <span className="text-gray-300 font-medium">
            {formatLargeNumber(challenge.totalSubmissions)}
          </span>
        </span>
        <span>
          Time limit:{' '}
          <span className="text-gray-300 font-medium">{challenge.timeLimit} ms</span>
        </span>
        <span>
          Memory:{' '}
          <span className="text-gray-300 font-medium">{challenge.memoryLimit} MB</span>
        </span>
      </div>
    </div>
  );
};

export default ChallengeHeader;
