import { useState } from "react";
import {
  Search,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import {
  validateCertificateId,
} from "../../validations/certificateValidation";

/**
 * Certificate verification form.
 *
 * The component only handles:
 * - Certificate ID input
 * - Local validation
 * - Form submission
 * - Resetting the input
 *
 * Verification API/business logic remains inside the hook.
 *
 * @param {Object} props
 * @param {Function} props.onVerify
 * @param {boolean} props.loading
 * @param {Object} props.validationErrors
 * @param {string} props.initialValue
 * @param {boolean} props.showReset
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const VerificationForm = ({
  onVerify,
  loading = false,
  validationErrors = {},
  initialValue = "",
  showReset = true,
  className = "",
}) => {
  const [certificateId, setCertificateId] =
    useState(initialValue);

  const [localError, setLocalError] =
    useState("");

  const handleChange = (event) => {
    const value = event.target.value;

    setCertificateId(value);

    if (localError) {
      setLocalError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation =
      validateCertificateId(
        certificateId
      );

    if (!validation.isValid) {
      setLocalError(validation.message);
      return;
    }

    setLocalError("");

    if (typeof onVerify === "function") {
      await onVerify(
        validation.value
      );
    }
  };

  const handleReset = () => {
    if (loading) {
      return;
    }

    setCertificateId("");
    setLocalError("");

    if (
      typeof onVerify === "function"
    ) {
      return;
    }
  };

  const externalValidationError =
    validationErrors?.certificateId || "";

  const errorMessage =
    localError || externalValidationError;

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6 ${className}`}
      noValidate
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
          <ShieldCheck
            className="h-5 w-5 sm:h-5.5 sm:w-5.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Verify Certificate
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Enter the Certificate ID to verify its authenticity.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="certificate-id"
          className="mb-2 block text-xs font-semibold text-slate-700 sm:text-sm"
        >
          Certificate ID
        </label>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="certificate-id"
            name="certificateId"
            type="text"
            value={certificateId}
            onChange={handleChange}
            placeholder="e.g. CERT-001"
            autoComplete="off"
            spellCheck="false"
            disabled={loading}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              errorMessage
                ? "certificate-id-error"
                : "certificate-id-help"
            }
            className={`min-h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:ring-2 sm:min-h-12 ${
              errorMessage
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
            } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
          />
        </div>

        {errorMessage ? (
          <p
            id="certificate-id-error"
            className="mt-2 text-xs font-medium leading-5 text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : (
          <p
            id="certificate-id-help"
            className="mt-2 text-[11px] leading-4 text-slate-400 sm:text-xs"
          >
            Use the Certificate ID exactly as shown on your certificate.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {showReset && certificateId ? (
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RotateCcw
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>Clear</span>
          </button>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />

              <span>
                Verifying...
              </span>
            </>
          ) : (
            <>
              <ShieldCheck
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span>
                Verify Certificate
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VerificationForm;