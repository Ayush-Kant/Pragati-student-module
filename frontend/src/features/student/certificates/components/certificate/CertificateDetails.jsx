import {
  Award,
  CalendarDays,
  Hash,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import CertificateStatusBadge from "./CertificateStatusBadge";

import {
  formatCertificateDateLong,
} from "../../utils/certificateHelpers";

/**
 * Display the core information of a certificate.
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
 * @param {boolean} props.showStatus
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const CertificateDetails = ({
  certificate = null,
  showStatus = true,
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
      className={`w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6 ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 sm:pb-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
          <Award
            className="h-5 w-5 sm:h-5.5 sm:w-5.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Certificate Details
          </h2>

          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Information associated with this certificate
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {/* Certificate title */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
              <Award
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Title
              </p>

              <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-800 sm:text-base">
                {title || "Untitled Certificate"}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
              <Hash
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Certificate ID
              </p>

              <p className="mt-1 break-all font-mono text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
                {id || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Issue date */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
              <CalendarDays
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Issue Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700 sm:text-base">
                {formatCertificateDateLong(
                  issueDate
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
              <ShieldCheck
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Verification
              </p>

              <div className="mt-1.5">
                <CertificateStatusBadge
                  status={
                    verificationStatus
                  }
                  type="verification"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStatus ? (
        <div className="mt-5 rounded-xl border border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">
                  Certificate Status
                </p>

                <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                  Current issuance status of this certificate.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <CertificateStatusBadge
                status={status}
                size="md"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default CertificateDetails;