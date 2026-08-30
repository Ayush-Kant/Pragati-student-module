import {
  Award,
  CalendarDays,
  Hash,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import CertificateStatusBadge from "../certificate/CertificateStatusBadge";

import { formatCertificateDateLong } from "../../utils/certificateHelpers";

/**
 * Display the result of certificate verification.
 *
 * Handles:
 * - Verified certificate
 * - Invalid / unverified certificate
 * - No result
 *
 * @param {Object} props
 * @param {Object|null} props.result
 * @param {Object|null} props.certificate
 * @param {boolean} props.verified
 * @param {string|null} props.error
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const VerificationResult = ({
  result = null,
  certificate = null,
  verified = false,
  error = null,
  className = "",
}) => {
  if (error) {
    return (
      <section
        className={`w-full rounded-2xl border border-red-100 bg-red-50/70 p-4 sm:p-5 md:p-6 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 sm:h-11 sm:w-11">
            <ShieldX
              className="h-5 w-5 sm:h-5.5 sm:w-5.5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-red-900 sm:text-base">
              Verification failed
            </h3>

            <p className="mt-1 text-xs leading-5 text-red-700 sm:text-sm">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    return null;
  }

  if (!verified || !certificate) {
    return (
      <section
        className={`w-full rounded-2xl border border-amber-100 bg-amber-50/70 p-4 sm:p-5 md:p-6 ${className}`}
        role="status"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 sm:h-11 sm:w-11">
            <ShieldX
              className="h-5 w-5 sm:h-5.5 sm:w-5.5"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-amber-900 sm:text-base">
              Certificate not verified
            </h3>

            <p className="mt-1 text-xs leading-5 text-amber-700 sm:text-sm">
              {result?.message ||
                "The Certificate ID could not be verified."}
            </p>
          </div>
        </div>
      </section>
    );
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
      className={`w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Verification banner */}
      <div className="border-b border-emerald-100 bg-emerald-50/80 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 sm:h-11 sm:w-11">
            <ShieldCheck
              className="h-5 w-5 sm:h-5.5 sm:w-5.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-900 sm:text-base">
                  Certificate verified successfully
                </h3>

                <p className="mt-1 text-xs leading-5 text-emerald-700 sm:text-sm">
                  The certificate information matches the verified certificate record.
                </p>
              </div>

              <CertificateStatusBadge
                status={verificationStatus}
                type="verification"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificate information */}
      <div className="p-4 sm:p-5 md:p-6">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">
            Certificate Information
          </p>

          <h4 className="mt-1 text-lg font-bold leading-6 text-slate-900 sm:text-xl">
            {title || "Untitled Certificate"}
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Certificate ID */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                <Hash
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Certificate ID
                </p>

                <p className="mt-1 break-all font-mono text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
                  {id || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Issue Date */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                <CalendarDays
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Issue Date
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {formatCertificateDateLong(
                    issueDate
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                <Award
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Certificate Status
                </p>

                <div className="mt-1.5">
                  <CertificateStatusBadge
                    status={status}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-50 ring-1 ring-slate-200">
                <ShieldCheck
                  className="h-4 w-4 text-emerald-600"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Verification Status
                </p>

                <div className="mt-1.5">
                  <CertificateStatusBadge
                    status={verificationStatus}
                    type="verification"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3.5">
          <p className="text-xs font-semibold text-emerald-800 sm:text-sm">
            Authenticity confirmed
          </p>

          <p className="mt-1 text-xs leading-5 text-emerald-700">
            This certificate can be considered valid based on the current verification result.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerificationResult;