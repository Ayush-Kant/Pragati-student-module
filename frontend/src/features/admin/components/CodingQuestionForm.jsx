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
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">
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
          className="w-full border p-2 rounded mb-3"
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
          className="w-full border p-2 rounded mb-3"
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
          className="w-full border p-2 rounded mb-3"
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
          className="w-full border p-2 rounded mb-3"
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
          className="w-full border p-2 rounded mb-3"
          placeholder="Marks"
          min="1"
          required
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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