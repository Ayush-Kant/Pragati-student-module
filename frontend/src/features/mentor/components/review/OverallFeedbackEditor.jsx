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
  className="
    w-full
    p-5
    resize-none
    outline-none
    border-0
    focus:ring-0
    text-gray-700
    placeholder:text-gray-400
  "
/>

      

    </div>
  );
}