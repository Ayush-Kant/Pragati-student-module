import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import * as adminService from "../services/adminService";

function CodingQuestionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isEdit =
    location.state?.mode === "edit";

  const question =
    location.state?.question;

  const [problemStatement, setProblemStatement] =
    useState(
      question?.problemStatement || ""
    );

  const [languageSupport, setLanguageSupport] =
    useState(
      question?.languageSupport || ""
    );

  const [sampleInput, setSampleInput] =
    useState(
      question?.sampleInput || ""
    );

  const [sampleOutput, setSampleOutput] =
    useState(
      question?.sampleOutput || ""
    );

  const [marks, setMarks] = useState(
    question?.marks || ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        type: "CODING",
        problemStatement,
        languageSupport,
        sampleInput,
        sampleOutput,
        marks: Number(marks),
      };

      if (isEdit) {
        await adminService.updateQuestion(
          id,
          question?.id || question?._id,
          payload
        );

        toast.success(
          "Coding Question updated successfully"
        );
      } else {
        await adminService.addQuestion(
          id,
          payload
        );

        toast.success(
          "Coding Question added successfully"
        );
      }

      navigate(
        `/admin/assessments/${id}`
      );
    } catch (error) {
      toast.error(
        error?.message ||
          "Failed to save coding question"
      );
    }
  };

  return (
    <div className="rounded-lg border p-3 md:p-4">
      <h3 className="mb-4 text-lg md:text-xl font-semibold">
        {isEdit
          ? "Edit Coding Question"
          : "Add Coding Question"}
      </h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={problemStatement}
          onChange={(e) =>
            setProblemStatement(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Problem Statement"
          rows={4}
          required
        />

        <input
          value={languageSupport}
          onChange={(e) =>
            setLanguageSupport(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition px-3 py-2 text-sm md:p-3 md:text-base"
          placeholder="Language Support (Java, Python, C++)"
          required
        />

        <textarea
          value={sampleInput}
          onChange={(e) =>
            setSampleInput(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Sample Input"
          rows={3}
          required
        />

        <textarea
          value={sampleOutput}
          onChange={(e) =>
            setSampleOutput(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:p-3 md:text-base"
          placeholder="Sample Output"
          rows={3}
          required
        />

        <input
          type="number"
          value={marks}
          onChange={(e) =>
            setMarks(
              e.target.value
            )
          }
          className="mb-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition px-3 py-2 text-sm md:p-3 md:text-base"
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
            className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 md:px-4 md:text-base"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 md:px-4 md:text-base"
          >
            {isEdit
              ? "Update Coding Question"
              : "Save Coding Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CodingQuestionForm;