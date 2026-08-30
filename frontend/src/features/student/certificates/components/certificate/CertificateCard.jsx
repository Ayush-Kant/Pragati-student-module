import {
  Award,
  CalendarDays,
  Eye,
  Download,
  ShieldCheck,
} from "lucide-react";

import CertificateStatusBadge from "./CertificateStatusBadge";

import {
  formatCertificateDate,
  isCertificateIssued,
  isCertificateVerified,
} from "../../utils/certificateHelpers";

/**
 * Certificate card for the earned certificates listing.
 *
 * Supported certificate fields:
 * - id
 * - title
 * - issueDate
 * - status
 * - verificationStatus
 *
 * @param {Object} props
 * @param {Object} props.certificate
 * @param {Function} props.onView
 * @param {Function} props.onDownload
 * @param {boolean} props.downloadLoading
 * @returns {JSX.Element}
 */
const CertificateCard = ({
  certificate = null,
  onView,
  onDownload,
  downloadLoading = false,
}) => {
  if (!certificate) {
    return null;
  }

  const {
    id,
    title,
    issueDate,
    status,
    verificationStatus,
  } = certificate;

  const issued = isCertificateIssued(
    certificate
  );

  const verified = isCertificateVerified(
    certificate
  );

  const handleView = () => {
    if (typeof onView === "function") {
      onView(certificate);
    }
  };

  const handleDownload = () => {
    if (
      typeof onDownload === "function" &&
      issued &&
      !downloadLoading
    ) {
      onDownload(certificate);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Certificate visual header */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 py-5 sm:px-5 sm:py-6">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-200/50" />
        <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-slate-200/40" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 sm:h-12 sm:w-12">
              <Award
                className="h-5 w-5 sm:h-6 sm:w-6"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <CertificateStatusBadge
              status={status}
              size="sm"
            />
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Certificate
            </p>

            <h3 className="mt-1.5 line-clamp-2 min-h-[3.5rem] text-base font-bold leading-6 text-slate-900 sm:text-lg">
              {title || "Untitled Certificate"}
            </h3>
          </div>
        </div>
      </div>

      {/* Certificate information */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="space-y-3">
          {/* Issue date */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <CalendarDays
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Issued on
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                {formatCertificateDate(
                  issueDate
                )}
              </p>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Certificate ID
            </p>

            <p className="mt-1 break-all font-mono text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
              {id || "N/A"}
            </p>
          </div>

          {/* Verification */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3.5 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <ShieldCheck
                className={`h-4 w-4 shrink-0 ${
                  verified
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
                aria-hidden="true"
              />

              <span className="truncate text-xs font-medium text-slate-600 sm:text-sm">
                Verification
              </span>
            </div>

            <CertificateStatusBadge
              status={verificationStatus}
              type="verification"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleView}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:text-sm"
            >
              <Eye
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span>View Details</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={
                !issued ||
                downloadLoading
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-sm"
            >
              {downloadLoading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />

                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  <span>
                    {issued
                      ? "Download"
                      : "Unavailable"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CertificateCard;