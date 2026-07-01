export default function OverallFeedbackEditor() {
  return (
    <div className="mt-6 border rounded-xl bg-white overflow-hidden">

      <div className="flex items-center justify-between px-5 py-4 border-b">

        <h3 className="font-semibold text-lg">
          Overall Feedback
        </h3>

        <button className="text-blue-600 text-sm font-medium">
          Insert Snippet
        </button>

      </div>

      <div className="flex items-center gap-4 px-5 py-3 border-b text-gray-600">

        <button className="font-bold">
          B
        </button>

        <button className="italic">
          I
        </button>

        <button>
          • List
        </button>

      </div>

      <textarea
        rows={8}
        placeholder="Write comprehensive feedback here..."
        className="w-full p-5 resize-none outline-none"
      />

      <div className="border-t flex justify-end gap-3 p-4 bg-gray-50">

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