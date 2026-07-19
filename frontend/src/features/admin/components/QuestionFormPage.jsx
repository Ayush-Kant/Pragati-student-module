import { useSearchParams } from "react-router-dom";
import MCQQuestionForm from "../components/MCQQuestionForm";
import CodingQuestionForm from "../components/CodingQuestionForm";

function QuestionFormPage() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");

  if (type === "Coding") {
    return <CodingQuestionForm />;
  }

  return <MCQQuestionForm />;
}

export default QuestionFormPage;