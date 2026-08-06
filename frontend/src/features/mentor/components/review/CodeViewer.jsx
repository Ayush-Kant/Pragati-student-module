export default function CodeViewer({
  code,
  selectedFile,
}) {
  const lines = code.split("\n");

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">

      {/* Header */}

      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-[#252526]">

        <span className="text-gray-200 font-medium">
          src/{selectedFile}
        </span>

        <span className="text-xs text-gray-400 uppercase">
          JavaScript
        </span>

      </div>

      {/* Code */}

      <div className="overflow-auto flex-1">

        <pre className="text-sm font-mono text-gray-100 p-6">

          {lines.map((line, index) => (

            <div
              key={index}
              className="flex"
            >

              <span
                className="
                w-10
                text-right
                mr-6
                text-gray-500
                select-none
                "
              >
                {index + 1}
              </span>

              <span>{line}</span>

            </div>

          ))}

        </pre>

      </div>

    </div>
  );
}