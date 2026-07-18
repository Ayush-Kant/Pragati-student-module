import { useMemo, useState } from "react";
import { Filter, Download, FileText, FileSpreadsheet } from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
export default function ShortlistedTab({ data }) {
  const [showFilter, setShowFilter] = useState(false);
const [showExport, setShowExport] = useState(false);

const [statusFilter, setStatusFilter] = useState("All");
const [scoreFilter, setScoreFilter] = useState("All");
const filteredCandidates = useMemo(() => {

  return data.filter((student) => {

    const statusMatch =
      statusFilter === "All" ||
      student.status === statusFilter;

    const scoreMatch =
      scoreFilter === "All" ||
      student.score >= Number(scoreFilter);

    return statusMatch && scoreMatch;

  });

}, [data, statusFilter, scoreFilter]);
const exportCSV = () => {
  const headers = [
    "Student",
    "Score",
    "Remarks",
    "Status",
  ];

  const rows = filteredCandidates.map((student) => [
    student.name,
    student.score,
    student.note,
    student.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "shortlisted_candidates.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("Shortlisted Candidates", 14, 20);

  autoTable(doc, {
    startY: 30,

    head: [["Student", "Score", "Remarks", "Status"]],

    body: filteredCandidates.map((student) => [
      student.name,
      `${student.score}%`,
      student.note,
      student.status,
    ]),
  });

  doc.save("shortlisted_candidates.pdf");
};
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <div className="p-5 border-b flex justify-between items-center">

        <div>
          <h2 className="text-xl font-semibold">
            Shortlisted Candidates
          </h2>

          <p className="text-gray-500 mt-1">
            Students ready to be shared with companies.
          </p>
        </div>

        <div className="flex items-center gap-3 relative">

  {/* Filter */}

  <div className="relative">

  <button
    onClick={() => {
      setShowFilter(!showFilter);
      setShowExport(false);
    }}
    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
  >
    <Filter size={16} />
    Filter
  </button>

  {showFilter && (

    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-xl z-50 p-4">

      <h3 className="font-semibold mb-3">
        Filter Candidates
      </h3>

      <label className="text-sm text-gray-500">
        Status
      </label>
      <label className="text-sm text-gray-500">
  Minimum Score
</label>

<select
  value={scoreFilter}
  onChange={(e) => setScoreFilter(e.target.value)}
  className="w-full mt-1 mb-4 border rounded-lg px-3 py-2"
>
  <option value="All">All</option>
  <option value="70">70+</option>
  <option value="80">80+</option>
  <option value="90">90+</option>
</select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full mt-1 mb-4 border rounded-lg px-3 py-2"
      >
        <option>All</option>

        <option>
          Visible to Companies
        </option>
      </select>

      <button
        onClick={() => setShowFilter(false)}
        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
      >
        Apply
      </button>

    </div>

  )}

</div>

  {/* Export */}

 <div className="relative">

  <button
    onClick={() => {
      setShowExport(!showExport);
      setShowFilter(false);
    }}
    className="
      flex
      items-center
      gap-2
      px-5
      py-2.5
      rounded-lg
      bg-blue-600
      text-white
      hover:bg-blue-700
      shadow-sm
      transition
    "
  >
    <Download size={17} />

    Export List

    <svg
      className={`w-4 h-4 transition-transform ${
        showExport ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>

  </button>

  {showExport && (

    <div
      className="
        absolute
        right-0
        mt-2
        w-56
        bg-white
        rounded-xl
        border
        shadow-xl
        overflow-hidden
        z-50
      "
    >

      <button
        onClick={() => {
          exportPDF();

toast.success("PDF downloaded successfully");
          
          setShowExport(false);
        }}
        className="
          w-full
          px-4
          py-3
          flex
          items-center
          gap-3
          hover:bg-gray-50
        "
      >
        <FileText size={18} />

        <div className="text-left">
          <p className="font-medium">
            PDF
          </p>

          <p className="text-xs text-gray-500">
            Download report
          </p>
        </div>

      </button>

      <button
        onClick={() => {
          exportCSV();
          toast.success("CSV downloaded successfully");
          setShowExport(false);
        }}
        className="
          w-full
          px-4
          py-3
          flex
          items-center
          gap-3
          hover:bg-gray-50
          border-t
        "
      >
        <FileSpreadsheet size={18} />

        <div className="text-left">
          <p className="font-medium">
            CSV
          </p>

          <p className="text-xs text-gray-500">
            Excel compatible
          </p>
        </div>

      </button>

    </div>

  )}

</div>

</div>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left p-4">Student</th>

            <th className="text-center p-4">Readiness Score</th>

            <th className="text-left p-4">Remarks</th>

            <th className="text-center p-4">Status</th>

          </tr>

        </thead>

        <tbody>

          {filteredCandidates.map((student) => (

            <tr
              key={student.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">

  <div className="flex items-center gap-3">

    <div
      className="
        w-9
        h-9
        rounded-full
        bg-blue-100
        text-blue-700
        flex
        items-center
        justify-center
        font-semibold
        text-sm
      "
    >
      {student.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)}
    </div>

    <span className="font-medium">
      {student.name}
    </span>

  </div>

</td>

              <td className="p-4">

  <div className="flex items-center gap-3">

    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">

      <div
        className="h-full bg-blue-600 rounded-full transition-all"
        style={{
          width: `${student.score}%`,
        }}
      />

    </div>

    <span className="text-sm font-semibold text-gray-700 min-w-[35px]">
      {student.score}
    </span>

  </div>

</td>

              <td className="p-4 max-w-xs">

  <p className="truncate">
    {student.note}
  </p>

</td>

              <td className="p-4 text-center">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {student.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
      <div className="flex items-center justify-between px-5 py-4 border-t bg-gray-50">

  <p className="text-sm text-gray-500">
    Showing {filteredCandidates.length} of {data.length} Candidates
  </p>

  <div className="flex items-center gap-2">

    <button
      className="w-8 h-8 border rounded hover:bg-gray-100"
    >
      ←
    </button>

    <button
      className="w-8 h-8 border rounded bg-blue-600 text-white"
    >
      1
    </button>

    <button
      className="w-8 h-8 border rounded hover:bg-gray-100"
    >
      →
    </button>

  </div>

</div>

    </div>
  );
}