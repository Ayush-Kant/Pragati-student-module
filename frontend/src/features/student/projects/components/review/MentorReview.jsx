import React from "react";
import ReviewScore from "./ReviewScore";
import ReviewComments from "./ReviewComments";
import FeedbackTimeline from "./FeedbackTimeline";

export const MentorReview = ({ reviews, onAddReply }) => {
  if (!reviews) return null;

  return (
    <div className="space-y-6">
      <ReviewScore
        score={reviews.overallScore}
        grade={reviews.grade}
        rubrics={reviews.rubricScores}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReviewComments comments={reviews.comments} onAddReply={onAddReply} />
        </div>
        <div>
          <FeedbackTimeline timeline={reviews.timeline} />
        </div>
      </div>
    </div>
  );
};

export default MentorReview;
