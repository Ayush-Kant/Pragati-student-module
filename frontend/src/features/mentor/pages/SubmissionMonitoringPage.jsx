import { useNavigate } from "react-router-dom";

import SubmissionSummaryCards from "../components/submission/SubmissionSummaryCards";
import SubmissionFilters from "../components/submission/SubmissionFilters";
import SubmissionTable from "../components/submission/SubmissionTable";
import NudgeWidget from "../components/submission/NudgeWidget";
import PenaltyConfiguration from "../components/submission/PenaltyConfiguration";

export default function SubmissionMonitoringPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50">

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-6">

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Submission Monitoring
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor project progress, identify inactive students, and manage
            submissions in real time.
          </p>
        </div>

        <button
          onClick={() => navigate("/mentor/review-grading")}
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
          <span>↗</span>
          <span>Review & Grade</span>
        </button>

      </div>

      {/* Summary Cards */}
      <section className="mb-6">
        <SubmissionSummaryCards />
      </section>

      {/* Filters */}
      <section className="mb-6">
        <SubmissionFilters />
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left */}
        <div className="xl:col-span-8">
          <SubmissionTable />
        </div>

        {/* Right */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <NudgeWidget />
          <PenaltyConfiguration />
        </div>

      </section>

    </div>
  );
}