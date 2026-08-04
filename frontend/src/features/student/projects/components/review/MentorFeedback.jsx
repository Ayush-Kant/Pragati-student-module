import React, { useState } from 'react';
import ReviewStatus from './ReviewStatus';
import ScoreCard from './ScoreCard';
import ReviewComments from './ReviewComments';
import EmptyState from '../common/EmptyState';
import { Award, UserCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/projectHelpers';

export const MentorFeedback = ({ feedback }) => {
  if (!feedback) {
    return (
      <EmptyState
        icon={Award}
        title="No Review Recorded Yet"
        description="Your project has not yet been evaluated by your assigned faculty mentor. Once submitted, feedback and scores will appear here."
      />
    );
  }

  const { mentorName, mentorRole, mentorAvatar, reviewedAt, status, overallScore, rubricScores, comments = [] } = feedback;
  const [localComments, setLocalComments] = useState(comments);

  const handleAddComment = (text) => {
    const newEntry = {
      id: `c-${Date.now()}`,
      author: 'Musthafa Ahmed (Student)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      timestamp: new Date().toISOString(),
      text,
    };
    setLocalComments((prev) => [...prev, newEntry]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Faculty Evaluator Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={mentorAvatar}
            alt={mentorName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Assigned Faculty Evaluator
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{mentorName}</h3>
            <p className="text-xs text-slate-400">{mentorRole} • Reviewed on {formatDateTime(reviewedAt)}</p>
          </div>
        </div>

        <ReviewStatus status={status} />
      </div>

      {/* Rubric Scorecard */}
      <ScoreCard overallScore={overallScore} rubricScores={rubricScores} />

      {/* Discussion Comments Thread */}
      <ReviewComments comments={localComments} onAddComment={handleAddComment} />
    </div>
  );
};

export default MentorFeedback;
