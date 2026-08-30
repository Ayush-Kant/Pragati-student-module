import { useState } from "react";
import {
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import VerificationForm from "./VerificationForm";
import VerificationStatus from "./VerificationStatus";
import VerificationResult from "./VerificationResult";

import useCertificateVerification from "../../hooks/useCertificateVerification";

/**
 * Complete certificate verification experience.
 *
 * Responsibilities:
 * - Connect verification form to verification hook
 * - Display verification state
 * - Display verification result
 * - Allow the user to verify another certificate
 *
 * Page-level heading/content is intentionally not repeated here.
 * The parent page owns the overall page introduction.
 *
 * @param {Object} props
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const CertificateVerification = ({
  className = "",
}) => {
  const {
    verificationResult,
    certificate,
    verified,
    loading,
    error,
    validationErrors,
    status,
    verify,
    reset,
  } = useCertificateVerification();

  const [hasSubmitted, setHasSubmitted] =
    useState(false);

  const hasResult =
    verificationResult !== null;

  const handleVerify = async (
    certificateId
  ) => {
    setHasSubmitted(true);
    await verify(certificateId);
  };

  const handleReset = () => {
    reset();
    setHasSubmitted(false);
  };

  return (
    <section
      className={`w-full ${className}`}
      aria-label="Certificate verification"
    >
      <div
        className={`grid gap-4 md:gap-5 ${
          hasResult
            ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            : "max-w-3xl"
        }`}
      >
        {/* -------------------------------------------------------------- */}
        {/* Verification Form                                              */}
        {/* -------------------------------------------------------------- */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-10 sm:w-10">
              <ShieldCheck
                className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Enter Certificate ID
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Enter the ID shown on the certificate you want to verify.
              </p>
            </div>
          </div>

          <VerificationForm
            onVerify={handleVerify}
            loading={loading}
            validationErrors={
              validationErrors
            }
            showReset={hasResult}
          />

          {/* Verification status */}
          {hasSubmitted ? (
            <div className="mt-4">
              <VerificationStatus
                status={status}
                verified={verified}
                message={
                  verificationResult?.message ||
                  error ||
                  ""
                }
              />
            </div>
          ) : null}

          {/* Verify another certificate */}
          {hasResult ? (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <RotateCcw
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>
                  Verify Another Certificate
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Verification Result                                            */}
        {/* -------------------------------------------------------------- */}

        {hasResult ? (
          <div className="min-w-0">
            <VerificationResult
              result={verificationResult}
              certificate={certificate}
              verified={verified}
              error={error}
            />
          </div>
        ) : (
          <div className="hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 lg:flex lg:min-h-[300px] lg:items-center lg:justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                <ShieldCheck
                  className="h-6 w-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-700">
                Verification result
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Enter a Certificate ID to view its authenticity and certificate information.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificateVerification;