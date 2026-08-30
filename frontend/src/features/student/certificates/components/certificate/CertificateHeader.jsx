import {
  Award,
  CalendarDays,
  Hash,
} from "lucide-react";

import CertificateStatusBadge from "./CertificateStatusBadge";

import { formatCertificateDate } from "../../utils/certificateHelpers";

/**
 * Header section for a certificate details/preview view.
 *
 * Supported certificate fields:
 * - id
 * - title
 * - issueDate
 * - status
 * - verificationStatus
 *
 * @param {Object} props
 * @param {Object|null} props.certificate
 * @param {React.ReactNode} props.actions
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const CertificateHeader = ({
  certificate = null,
  actions = null,
  className = "",
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

  return (
    <section
      className={`w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6 lg:p-7 ${className}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Main certificate information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-12 sm:w-12">
              <Award
                className="h-5 w-5 sm:h-6 sm:w-6"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">
                Certificate
              </p>

              <h1 className="mt-1 text-xl font-bold leading-7 tracking-tight text-slate-900 sm:text-2xl sm:leading-8 lg:text-3xl lg:leading-9">
                {title || "Untitled Certificate"}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
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
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                <Hash
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Certificate ID
                </p>

                <p className="mt-0.5 break-all font-mono text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
                  {id || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                <CalendarDays
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

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
          </div>
        </div>

        {/* Optional actions */}
        {actions ? (
          <div className="w-full shrink-0 lg:w-auto lg:min-w-[180px]">
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col">
              {actions}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CertificateHeader;