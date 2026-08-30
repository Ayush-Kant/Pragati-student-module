import {
  Award,
  CalendarDays,
  Hash,
  ShieldCheck,
} from "lucide-react";

import CertificateStatusBadge from "../certificate/CertificateStatusBadge";

import { formatCertificateDate } from "../../utils/certificateHelpers";

/**
 * Display one certificate history entry.
 *
 * History items are derived from the approved certificate structure
 * by the certificate service.
 *
 * Supported fields:
 * - id
 * - certificateId
 * - title
 * - issueDate
 * - status
 * - verificationStatus
 *
 * @param {Object} props
 * @param {Object|null} props.historyItem
 * @param {Function} props.onView
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const HistoryCard = ({
  historyItem = null,
  onView,
  className = "",
}) => {
  if (!historyItem) {
    return null;
  }

  const {
    id,
    certificateId,
    title,
    issueDate,
    status,
    verificationStatus,
  } = historyItem;

  const handleView = () => {
  if (
    typeof onView === "function" &&
    historyItem?.certificateId
  ) {
    onView(historyItem.certificateId);
  }
};

  return (
    <article
      className={`w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Main information */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
            <Award
              className="h-5 w-5 sm:h-5.5 sm:w-5.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 sm:text-base">
              {title || "Untitled Certificate"}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CertificateStatusBadge
                status={status}
                size="sm"
              />

              <CertificateStatusBadge
                status={verificationStatus}
                type="verification"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:min-w-[300px] lg:min-w-[360px]">
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
            <CalendarDays
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Issue Date
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-700 sm:text-sm">
                {formatCertificateDate(
                  issueDate
                )}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
            <Hash
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Certificate ID
              </p>

              <p className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-700 sm:text-sm">
                {certificateId || id || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        {typeof onView === "function" ? (
          <div className="shrink-0 md:w-auto">
            <button
              type="button"
              onClick={handleView}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 md:w-auto sm:text-sm"
            >
              <ShieldCheck
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span>View Certificate</span>
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default HistoryCard;