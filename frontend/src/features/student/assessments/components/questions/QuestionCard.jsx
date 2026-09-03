import MCQOptions from "./MCQOptions";
import TrueFalseOptions from "./TrueFalseOptions";
import FillBlankInput from "./FillBlankInput";
import MatchFollowingInput from "./MatchFollowingInput";

const normalizeType = (value) => {
  const type = String(value || "MCQ").toUpperCase().replace(/[\s-]+/g, "_");
  if (["TRUEFALSE", "TRUE_FALSE", "TRUE/FALSE"].includes(type)) return "TRUE_FALSE";
  if (["FIB", "FILL_BLANK", "FILL_IN_THE_BLANK", "FILL_IN_BLANK"].includes(type)) return "FILL_BLANK";
  if (["MATCH", "MATCH_THE_FOLLOWING", "MATCH_FOLLOWING"].includes(type)) return "MATCH";
  return type;
};

const optionText = (option) => (option && typeof option === "object" ? option.text ?? option.label ?? option.value ?? "" : String(option));

export default function QuestionCard({ question, questionIndex, answer, onChangeAnswer }) {
  if (!question) return null;
  const type = normalizeType(question.type);
  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-600">Question {questionIndex + 1}</p>
          <h3 className="text-lg font-semibold leading-7 text-gray-800">{question.text || question.questionText || "Question"}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{type}</span>
      </div>

      {type === "MCQ" && (
        <MCQOptions
          options={options.map(optionText)}
          selectedOption={answer?.optionIndex}
          onSelect={(optionIndex) => onChangeAnswer({ optionIndex })}
        />
      )}

      {type === "TRUE_FALSE" && (
        <TrueFalseOptions
          options={options.map((option, index) => ({ id: String(option?.id ?? `option_${index}`), text: optionText(option) }))}
          value={answer?.value}
          onChange={(value) => onChangeAnswer({ value })}
        />
      )}

      {type === "FILL_BLANK" && (
        <FillBlankInput
          value={answer?.text || ""}
          onChange={(text) => onChangeAnswer({ text })}
        />
      )}

      {type === "MATCH" && (
        <MatchFollowingInput
          options={typeof question.options === "object" && !Array.isArray(question.options) ? question.options : { left: [], right: [] }}
          value={answer?.matches || {}}
          onChange={(matches) => onChangeAnswer({ matches })}
        />
      )}

      {!['MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'MATCH'].includes(type) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This assessment contains an unsupported question type ({type}). Please contact your mentor rather than submitting an incomplete answer.
        </div>
      )}
    </div>
  );
}
