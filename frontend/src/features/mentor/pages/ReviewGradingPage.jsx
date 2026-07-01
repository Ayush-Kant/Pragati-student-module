import { useState } from "react";
import SubmissionViewer from "../components/review/SubmissionViewer";
import RubricPanel from "../components/review/RubricPanel";

export default function ReviewGradingPage() {

  const [selectedFile, setSelectedFile] = useState("app.js");

  return (
    <div className="flex flex-col h-full gap-5">

      {/* Header */}

<div className="bg-white rounded-xl border border-gray-200 px-7 py-6">

  <div className="flex justify-between items-start">

    <div>

      <div className="flex items-center gap-4">

        <h1 className="text-4xl font-bold text-gray-900">
          Alex Rivers
        </h1>

        <span
  className="
  px-3
  py-1
  rounded-full
  bg-indigo-100
  text-indigo-700
  text-xs
  font-semibold
  "
>
  Submitted
</span>

      </div>

      <div
        className="
        flex
        items-center
        gap-3
        mt-3
        text-gray-500
        text-sm
        "
      >

        <span>E-commerce API</span>

        <span>•</span>

        <span> Oct 24, 2023</span>

      </div>

    </div>

    <button
  className="
    flex
    items-center
    gap-2
    border
    border-gray-200
    rounded-xl
    px-5
    py-2
    text-blue-600
    font-medium
    hover:bg-blue-50
    transition
  "
>
  <>
    <span>↗</span>
    <span>Open Full</span>
  </>
</button>

  </div>

</div>
{/* Workspace */}

<div
  className="
flex-1
grid
grid-cols-[1fr_420px]
gap-5
min-h-0
"
>

  <SubmissionViewer
    selectedFile={selectedFile}
    onSelect={setSelectedFile}
  />

  <RubricPanel />

</div>
    </div>
  );
}