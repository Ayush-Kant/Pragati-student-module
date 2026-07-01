import AISummaryCard from "./AISummaryCard";
import ScoreSummary from "./ScoreSummary";
import RubricCriterionCard from "./RubricCriterionCard";
import OverallFeedbackEditor from "./OverallFeedbackEditor";

export default function RubricPanel() {

    return (

        <div className="flex flex-col h-full">

            <div className="flex justify-between items-start">

                <div>

                    <h2 className="text-2xl font-bold">
                        Grading Rubric
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Reviewing against Standard Enterprise Criteria
                    </p>

                </div>

                <ScoreSummary/>

            </div>

            <AISummaryCard/>

            <h3 className="font-semibold text-lg mt-6 mb-4">
                Scoring Criteria
            </h3>

            <div className="space-y-4">

                <RubricCriterionCard
                    title="Architecture & Design"
                    description="Appropriate separation of concerns."
                    score={13}
                />

                <RubricCriterionCard
                    title="Code Quality"
                    description="Readable and maintainable code."
                    score={14}
                />

                <RubricCriterionCard
                    title="Performance"
                    description="Efficient implementation."
                    score={12}
                />

                <RubricCriterionCard
                    title="Documentation"
                    description="Comments and documentation."
                    score={11}
                />

            </div>

            <OverallFeedbackEditor />

        </div>

    );

}