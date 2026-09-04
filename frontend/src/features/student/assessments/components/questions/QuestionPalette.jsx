import { isAnswerProvided } from "../../utils/answerState";

export default function QuestionPalette({ totalQuestions, currentIndex, answers = {}, questions = [], onSelectQuestion }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h4 className="mb-3 font-semibold text-gray-700">Question Palette</h4>
      <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />Answered</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-slate-200" />Unanswered</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const questionId = questions[index]?.id;
          const isAnswered = questionId !== undefined && isAnswerProvided(answers[String(questionId)]);
          const isCurrent = currentIndex === index;
          let style = isAnswered ? "bg-emerald-500 text-white border-emerald-600" : "bg-slate-100 text-slate-600 border-slate-200";
          if (isCurrent) style += " ring-2 ring-blue-500 font-bold";
          return (
            <button
              key={questionId ?? index}
              type="button"
              onClick={() => onSelectQuestion(index)}
              className={`h-10 w-10 rounded-lg border flex items-center justify-center transition hover:scale-105 ${style}`}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
