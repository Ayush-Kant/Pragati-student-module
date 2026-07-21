import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import * as adminService from "../services/adminService";
import { toast } from "react-hot-toast";

function MCQQuestionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isEdit =
    location.state?.mode === "edit";

  const question =
    location.state?.question;

  const [questionText, setQuestionText] =
    useState(
      question?.questionText || ""
    );

  const [optionA, setOptionA] =
    useState(
      question?.options?.[0] || ""
    );

  const [optionB, setOptionB] =
    useState(
      question?.options?.[1] || ""
    );

  const [optionC, setOptionC] =
    useState(
      question?.options?.[2] || ""
    );

  const [optionD, setOptionD] =
    useState(
      question?.options?.[3] || ""
    );

  const [correctAnswer, setCorrectAnswer] =
    useState(
      question?.correctAnswer || ""
    );

  const [marks, setMarks] = useState(
    question?.marks || ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        type: "MCQ",
        questionText,
        options: [
          optionA,
          optionB,
          optionC,
          optionD,
        ],
        correctAnswer,
        marks: Number(marks),
      };

      if (isEdit) {
        await adminService.updateQuestion(
          id,
          question.id || question._id,
          payload
        );

        toast.success(
          "Question updated successfully"
        );
      } else {
        await adminService.addQuestion(
          id,
          payload
        );

        toast.success(
          "Question added successfully"
        );
      }

      navigate(
        `/admin/assessments/${id}`
      );
    } catch (error) {
      toast.error(
        error?.message ||
          "Operation failed"
      );
    }
  };

  return (
    <div className="rounded-lg border p-3 md:p-4">
      <h3 className="mb-4 text-lg md:text-xl font-semibold">
        {isEdit
          ? "Edit MCQ Question"
          : "Add MCQ Question"}
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          value={questionText}
          onChange={(e) =>
            setQuestionText(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Question Text"
          required
        />

        <input
          value={optionA}
          onChange={(e) =>
            setOptionA(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Option A"
          required
        />

        <input
          value={optionB}
          onChange={(e) =>
            setOptionB(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Option B"
          required
        />

        <input
          value={optionC}
          onChange={(e) =>
            setOptionC(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Option C"
          required
        />

        <input
          value={optionD}
          onChange={(e) =>
            setOptionD(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Option D"
          required
        />

        <select
          value={correctAnswer}
          onChange={(e) =>
            setCorrectAnswer(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border px-3 py-2 text-sm md:p-3 md:text-base"
          required
        >
          <option value="">
            Select Correct Option
          </option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <input
          type="number"
          value={marks}
          onChange={(e) =>
            setMarks(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Marks"
          min="1"
          required
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="px-3 py-2 text-sm md:px-4 md:text-base border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-3 py-2 text-sm md:px-4 md:text-base bg-blue-600 text-white rounded-lg border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
          >
            {isEdit
              ? "Update Question"
              : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MCQQuestionForm;