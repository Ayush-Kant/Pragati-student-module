import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
} from "lucide-react";

import CertificatePreview from "../components/certificate/CertificatePreview";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";

import useCertificateDetails from "../hooks/useCertificateDetails";
import useCertificateDownload from "../hooks/useCertificateDownload";

import {
  isDownloadAvailable,
} from "../utils/certificateHelpers";

/**
 * Full certificate preview page.
 *
 * Responsibilities:
 * - Read certificate ID from route parameters
 * - Fetch certificate details through the hook
 * - Render the full certificate preview
 * - Provide certificate download action
 *
 * @returns {JSX.Element}
 */
const CertificatePreviewPage = () => {
  const { certificateId } = useParams();

  const {
    certificate,
    loading,
    error,
    refetch,
  } = useCertificateDetails(
    certificateId
  );

  const {
    loading: downloadLoading,
    error: downloadError,
    download,
  } = useCertificateDownload();

  const handleDownload = async () => {
    if (!certificate) {
      return;
    }

    await download(
      certificate.id,
      certificate
    );
  };

  const downloadAvailable =
    isDownloadAvailable(
      certificate
    );

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <LoadingSpinner
            size="lg"
            label="Loading certificate preview..."
            fullScreen
          />
        </div>
      </main>
    );
  }

  if (error && !certificate) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            to="/student/certificates"
            className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificates
            </span>
          </Link>

          <ErrorState
            title="Unable to load certificate"
            message={error}
            onRetry={refetch}
            retryLabel="Try again"
          />
        </div>
      </main>
    );
  }

  if (!certificate) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            to="/student/certificates"
            className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificates
            </span>
          </Link>

          <ErrorState
            title="Certificate not found"
            message="The requested certificate could not be found."
            onRetry={refetch}
            retryLabel="Try again"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Top navigation */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/student/certificates/${certificate.id}`}
            className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificate Details
            </span>
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={`/student/certificates/${certificate.id}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:text-sm"
            >
              <ExternalLink
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span>
                Certificate Details
              </span>
            </Link>

            <button
              type="button"
              onClick={handleDownload}
              disabled={
                !downloadAvailable ||
                downloadLoading
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-sm"
            >
              {downloadLoading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />

                  <span>
                    Downloading...
                  </span>
                </>
              ) : (
                <>
                  <Download
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  <span>
                    {downloadAvailable
                      ? "Download"
                      : "Unavailable"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Page heading */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">
            Certificate Preview
          </p>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
            {certificate.title ||
              "Certificate"}
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Review your certificate before downloading the final document.
          </p>
        </section>

        {/* Download error */}
        {downloadError ? (
          <div className="mb-5 sm:mb-6">
            <ErrorState
              title="Download failed"
              message={downloadError}
              onRetry={handleDownload}
              retryLabel="Try download again"
            />
          </div>
        ) : null}

        {/* Certificate preview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 md:p-6">
          <CertificatePreview
            certificate={certificate}
          />
        </section>

        {/* Bottom actions */}
        <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
          <Link
            to={`/student/certificates/${certificate.id}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:w-auto"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Details
            </span>
          </Link>

          <button
            type="button"
            onClick={handleDownload}
            disabled={
              !downloadAvailable ||
              downloadLoading
            }
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {downloadLoading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />

                <span>
                  Downloading...
                </span>
              </>
            ) : (
              <>
                <Download
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>
                  {downloadAvailable
                    ? "Download Certificate"
                    : "Download Unavailable"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Certificate metadata */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Certificate ID
            </p>

            <p className="mt-1 break-all font-mono text-xs font-semibold tracking-wide text-slate-700 sm:text-sm">
              {certificate.id || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Verification
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {certificate.verificationStatus ||
                "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CertificatePreviewPage;