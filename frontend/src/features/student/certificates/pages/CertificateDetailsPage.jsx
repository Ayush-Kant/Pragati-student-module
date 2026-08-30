import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
} from "lucide-react";

import CertificateHeader from "../components/certificate/CertificateHeader";
import CertificateDetails from "../components/certificate/CertificateDetails";
import CertificatePreview from "../components/certificate/CertificatePreview";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";

import useCertificateDetails from "../hooks/useCertificateDetails";
import useCertificateDownload from "../hooks/useCertificateDownload";

import {
  isDownloadAvailable,
} from "../utils/certificateHelpers";

/**
 * Certificate details page.
 *
 * Responsibilities:
 * - Read certificate ID from route parameters
 * - Fetch certificate details through the hook
 * - Display certificate information
 * - Display certificate preview
 * - Start certificate download
 *
 * Reserved CertificatesPage.jsx is intentionally not used here.
 *
 * @returns {JSX.Element}
 */
const CertificateDetailsPage = () => {
  const { certificateId } = useParams();

  const navigate = useNavigate();

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
    reset: resetDownload,
  } = useCertificateDownload();

  const handleBack = () => {
    navigate("/student/certificates");
  };

  const handleViewPreview = () => {
    if (!certificate?.id) {
      return;
    }

    navigate(
      `/student/certificates/${certificate.id}/preview`
    );
  };

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
    isDownloadAvailable(certificate);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <LoadingSpinner
            size="lg"
            label="Loading certificate details..."
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
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificates
            </span>
          </button>

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
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificates
            </span>
          </button>

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
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Breadcrumb / back navigation */}
        <div className="mb-5 sm:mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:text-sm"
          >
            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              Back to Certificates
            </span>
          </button>
        </div>

        {/* Page content */}
        <div className="space-y-5 sm:space-y-6">
          <CertificateHeader
            certificate={certificate}
            actions={
              <>
                <button
                  type="button"
                  onClick={handleViewPreview}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 lg:w-auto"
                >
                  <Eye
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  <span>
                    Preview Certificate
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={
                    !downloadAvailable ||
                    downloadLoading
                  }
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 lg:w-auto"
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
              </>
            }
          />

          {/* Download error */}
          {downloadError ? (
            <ErrorState
              title="Download failed"
              message={downloadError}
              onRetry={handleDownload}
              retryLabel="Try download again"
            />
          ) : null}

          {/* Certificate information */}
          <CertificateDetails
            certificate={certificate}
          />

          {/* Preview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">
                Preview
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Certificate Preview
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Review how your certificate will appear before downloading it.
              </p>
            </div>

            <CertificatePreview
              certificate={certificate}
            />

            <div className="mt-5 flex justify-center">
              <Link
                to={`/student/certificates/${certificate.id}/preview`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:text-sm"
              >
                <Eye
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>
                  Open Full Preview
                </span>
              </Link>
            </div>
          </section>

          {/* Download failure retry helper */}
          {downloadError ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  resetDownload();
                  handleDownload();
                }}
                className="text-xs font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-900 sm:text-sm"
              >
                Retry download
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default CertificateDetailsPage;