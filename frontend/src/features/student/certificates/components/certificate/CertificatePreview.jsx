import { Award, CalendarDays, ShieldCheck } from "lucide-react";

import {
  formatCertificateDateLong,
  isCertificateVerified,
} from "../../utils/certificateHelpers";

/**
 * Visual certificate preview.
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
 * @param {boolean} props.showActions
 * @param {React.ReactNode} props.actions
 * @param {string} props.className
 * @returns {JSX.Element|null}
 */
const CertificatePreview = ({
  certificate = null,
  showActions = false,
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

  const verified = isCertificateVerified(
    certificate
  );

  return (
    <section
      className={`w-full ${className}`}
      aria-label="Certificate preview"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Preview frame */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-2 shadow-sm sm:p-3 md:p-4">
          {/* Certificate */}
          <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />

            <div className="absolute -right-[10%] -top-[15%] h-1/2 w-1/3 rounded-full bg-slate-200/50 blur-3xl" />

            <div className="absolute -bottom-[15%] -left-[10%] h-1/2 w-1/3 rounded-full bg-slate-200/40 blur-3xl" />

            {/* Outer certificate border */}
            <div className="absolute inset-[3%] rounded-lg border border-slate-300 sm:inset-[4%]">
              <div className="absolute inset-[1.5%] rounded-md border border-slate-200" />
            </div>

            {/* Certificate content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between px-[7%] py-[7%] text-center sm:px-[8%] sm:py-[8%]">
              {/* Top */}
              <div className="flex w-full flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm sm:h-10 sm:w-10 md:h-12 md:w-12">
                  <Award
                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:mt-3 sm:text-[9px] md:text-[10px]">
                  Certificate of Achievement
                </p>

                <div className="mt-2 h-px w-16 bg-slate-300 sm:mt-3 sm:w-24 md:w-32" />
              </div>

              {/* Main certificate title */}
              <div className="flex max-w-3xl flex-col items-center">
                <p className="text-[7px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:text-[9px] md:text-[10px]">
                  This certificate is proudly presented for successfully completing
                </p>

                <h2 className="mt-2 max-w-2xl text-[12px] font-bold leading-tight text-slate-900 sm:mt-3 sm:text-lg md:text-2xl lg:text-3xl">
                  {title || "Untitled Certificate"}
                </h2>

                <p className="mt-2 max-w-2xl text-[7px] leading-relaxed text-slate-500 sm:mt-3 sm:text-[9px] md:text-xs lg:text-sm">
                  The recipient has successfully met the requirements
                  associated with this certificate.
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="w-full">
                <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 border-t border-slate-200 pt-3 sm:gap-4 sm:pt-4 md:pt-5">
                  <div className="min-w-0">
                    <p className="text-[6px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[8px] md:text-[9px]">
                      Certificate ID
                    </p>

                    <p className="mt-0.5 break-all font-mono text-[7px] font-semibold text-slate-700 sm:text-[9px] md:text-[10px] lg:text-xs">
                      {id || "N/A"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[6px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[8px] md:text-[9px]">
                      Issue Date
                    </p>

                    <p className="mt-0.5 text-[7px] font-semibold text-slate-700 sm:text-[9px] md:text-[10px] lg:text-xs">
                      {formatCertificateDateLong(
                        issueDate
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-center gap-1.5 sm:mt-3 sm:gap-2">
                  <ShieldCheck
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ${
                      verified
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                    aria-hidden="true"
                  />

                  <span
                    className={`text-[7px] font-semibold sm:text-[9px] md:text-[10px] ${
                      verified
                        ? "text-emerald-700"
                        : "text-slate-500"
                    }`}
                  >
                    {verified
                      ? "Certificate Verified"
                      : `Certificate ${status || "Status Unavailable"}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional actions */}
        {showActions && actions ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
            {actions}
          </div>
        ) : null}
      </div>

      {/* Accessibility metadata */}
      <div className="sr-only">
        <p>
          Certificate:{" "}
          {title || "Untitled Certificate"}
        </p>

        <p>
          Certificate ID: {id || "N/A"}
        </p>

        <p>
          Issue date:{" "}
          {formatCertificateDateLong(
            issueDate
          )}
        </p>

        <p>
          Verification status:{" "}
          {verificationStatus || "Unknown"}
        </p>
      </div>
    </section>
  );
};

export default CertificatePreview;