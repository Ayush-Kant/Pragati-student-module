import { useState } from "react";

import AISummaryCard from "./AISummaryCard";
import ScoreSummary from "./ScoreSummary";
import RubricCriterionCard from "./RubricCriterionCard";

export default function RubricPanel() {

  const [scores, setScores] = useState({
    architecture: 13,
    quality: 14,
    performance: 12,
    documentation: 11,
  });

  const totalScore =
    scores.architecture +
    scores.quality +
    scores.performance +
    scores.documentation;

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold">
            Grading Rubric
          </h2>

          <p className="text-gray-500 mt-1">
            Reviewing against Standard Enterprise Criteria
          </p>

        </div>

        <ScoreSummary score={totalScore} />

      </div>

      {/* Scrollable Content */}

      <div className="flex-1 overflow-y-auto pr-2">

        <AISummaryCard />

        <h3 className="font-semibold text-lg mt-6 mb-4">
          Scoring Criteria
        </h3>

        <div className="space-y-4">

          <RubricCriterionCard
            title="Architecture & Design"
            description="Appropriate separation of concerns."
            score={scores.architecture}
            onScoreChange={(value) =>
              setScores((prev) => ({
                ...prev,
                architecture: value,
              }))
            }
          />

          <RubricCriterionCard
            title="Code Quality"
            description="Readable and maintainable code."
            score={scores.quality}
            onScoreChange={(value) =>
              setScores((prev) => ({
                ...prev,
                quality: value,
              }))
            }
          />

          <RubricCriterionCard
            title="Performance"
            description="Efficient implementation."
            score={scores.performance}
            onScoreChange={(value) =>
              setScores((prev) => ({
                ...prev,
                performance: value,
              }))
            }
          />

          <RubricCriterionCard
            title="Documentation"
            description="Comments and documentation."
            score={scores.documentation}
            onScoreChange={(value) =>
              setScores((prev) => ({
                ...prev,
                documentation: value,
              }))
            }
          />

        </div>

      </div>

      {/* Bottom Action Bar */}

      <div className="border-t bg-white p-4 flex justify-end gap-3 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">

        <button className="px-6 py-2 rounded-lg border hover:bg-gray-100">
          Save Draft
        </button>

        <button className="px-6 py-2 rounded-lg border hover:bg-gray-100">
          Preview
        </button>

        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Publish Grade
        </button>

      </div>

    </div>
  );
}