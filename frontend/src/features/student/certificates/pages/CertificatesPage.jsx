import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  Download,
  History,
  Search,
  ShieldCheck,
} from "lucide-react";

import CertificateCard from "../components/certificate/CertificateCard";

import EligibilityCard from "../components/eligibility/EligibilityCard";

import CertificateHistory from "../components/history/CertificateHistory";

import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import SectionHeader from "../components/common/SectionHeader";
import ConfirmationModal from "../components/common/ConfirmationModal";

import useCertificates from "../hooks/useCertificates";
import useCertificateEligibility from "../hooks/useCertificateEligibility";
import useCertificateDownload from "../hooks/useCertificateDownload";

import {
  isCertificateIssued,
} from "../utils/certificateHelpers";

/**
 * Main Certificates page.
 *
 * Responsibilities:
 * - Display earned certificates
 * - Display certificate eligibility
 * - Navigate to certificate details
 * - Start certificate downloads after confirmation
 * - Display certificate history
 * - Display download history
 * - Handle loading, empty, and error states
 *
 * The page intentionally contains no direct API calls.
 * Data access is handled by the feature hooks.
 *
 * @returns {JSX.Element}
 */
const CertificatesPage = () => {
  const navigate = useNavigate();

  const {
    certificates,
    history,
    downloadHistory,
    loading,
    historyLoading,
    downloadHistoryLoading,
    error,
    historyError,
    downloadHistoryError,
    refetch,
    refetchHistory,
    refetchDownloadHistory,
  } = useCertificates();

  const {
    eligibility,
    loading: eligibilityLoading,
    error: eligibilityError,
    refetch: refetchEligibility,
  } = useCertificateEligibility();

  const {
    loading: downloadLoading,
    success: downloadSuccess,
    error: downloadError,
    download,
    reset: resetDownload,
  } = useCertificateDownload();

  const [
    selectedCertificate,
    setSelectedCertificate,
  ] = useState(null);

  const [
    isDownloadModalOpen,
    setIsDownloadModalOpen,
  ] = useState(false);

 const handleViewCertificate = (
  certificateOrId
) => {
  const certificateId =
    typeof certificateOrId === "string"
      ? certificateOrId
      : certificateOrId?.id;

  if (!certificateId) {
    return;
  }

  navigate(
    `/student/certificates/${certificateId}`
  );
};

  const handleOpenDownloadModal = (
    certificate
  ) => {
    if (
      !certificate ||
      !isCertificateIssued(certificate)
    ) {
      return;
    }

    resetDownload();

    setSelectedCertificate(
      certificate
    );

    setIsDownloadModalOpen(true);
  };

  const handleCloseDownloadModal = () => {
    if (downloadLoading) {
      return;
    }

    setIsDownloadModalOpen(false);
    setSelectedCertificate(null);
    resetDownload();
  };

  const handleConfirmDownload = async () => {
    if (!selectedCertificate) {
      return;
    }

    const response = await download(
      selectedCertificate.id,
      selectedCertificate
    );

    if (response?.success === true) {
      setIsDownloadModalOpen(false);
      setSelectedCertificate(null);

      /*
       * Reset download state after the modal is closed
       * so the next download starts from a clean state.
       */
      window.setTimeout(() => {
        resetDownload();
      }, 300);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-9 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* ------------------------------------------------------------------ */}
        {/* Page Header                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-12 sm:w-12">
                <Award
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">
                  Student Certificates
                </p>

                <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  My Certificates
                </h1>

                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                  View your earned certificates, check eligibility, download certificates, and review your certificate history.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <Link
                to="/student/certificates/verify"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:w-auto"
              >
                <ShieldCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>
                  Verify Certificate
                </span>
              </Link>

              <Link
                to="/student/certificates"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 sm:w-auto"
              >
                <Award
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>
                  Certificates
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Eligibility                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-6 sm:mt-7">
          <EligibilityCard
            eligibility={eligibility}
            loading={eligibilityLoading}
            error={eligibilityError}
            onRetry={refetchEligibility}
          />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Earned Certificates                                                */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-8 sm:mt-10">
          <SectionHeader
            eyebrow="Achievements"
            title="Earned Certificates"
            description="Your certificates are displayed here once they have been issued."
            action={
              <Link
                to="/student/certificates/verify"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:text-sm"
              >
                <Search
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>
                  Verify a Certificate
                </span>
              </Link>
            }
          />

          <div className="mt-5">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 shadow-sm sm:px-6 sm:py-12">
                <LoadingSpinner
                  size="lg"
                  label="Loading certificates..."
                />
              </div>
            ) : error ? (
              <ErrorState
                title="Unable to load certificates"
                message={error}
                onRetry={refetch}
                retryLabel="Try again"
              />
            ) : !Array.isArray(
                certificates
              ) ||
              certificates.length === 0 ? (
              <EmptyState
                icon={Award}
                title="No certificates yet"
                description="Your earned certificates will appear here once you complete the required program criteria and a certificate is issued."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {certificates.map(
                  (certificate) => (
                    <CertificateCard
                      key={certificate.id}
                      certificate={
                        certificate
                      }
                      onView={
                        handleViewCertificate
                      }
                      onDownload={
                        handleOpenDownloadModal
                      }
                      downloadLoading={
                        downloadLoading &&
                        selectedCertificate?.id ===
                          certificate.id
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Certificate Activity Summary                                       */}
        {/* ------------------------------------------------------------------ */}

        {!loading &&
        Array.isArray(certificates) &&
        certificates.length > 0 ? (
          <section className="mt-8 sm:mt-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Certificates
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                      {certificates.length}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Award
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Certificates currently available in your account.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Verified
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                      {
                        certificates.filter(
                          (certificate) =>
                            certificate.verificationStatus ===
                            "Verified"
                        ).length
                      }
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Certificates with verified authenticity.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Download Activity
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                      {Array.isArray(
                        downloadHistory
                      )
                        ? downloadHistory.length
                        : 0}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Download
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Recorded certificate download activity.
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Certificate History                                                */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-8 sm:mt-10">
          <CertificateHistory
            history={history}
            downloadHistory={
              downloadHistory
            }
            loading={loading}
            historyLoading={
              historyLoading
            }
            downloadHistoryLoading={
              downloadHistoryLoading
            }
            error={error}
            historyError={
              historyError
            }
            downloadHistoryError={
              downloadHistoryError
            }
            onRetry={refetch}
            onRetryHistory={
              refetchHistory
            }
            onRetryDownloadHistory={
              refetchDownloadHistory
            }
            onView={
              handleViewCertificate
            }
          />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Download Confirmation                                              */}
        {/* ------------------------------------------------------------------ */}

        <ConfirmationModal
          isOpen={isDownloadModalOpen}
          title="Download Certificate?"
          description={
            selectedCertificate
              ? `You're about to download "${selectedCertificate.title}" as a PDF.`
              : "You're about to download this certificate."
          }
          confirmLabel="Download Certificate"
          cancelLabel="Cancel"
          loading={downloadLoading}
          loadingLabel="Preparing certificate..."
          onConfirm={
            handleConfirmDownload
          }
          onCancel={
            handleCloseDownloadModal
          }
        />

        {/* ------------------------------------------------------------------ */}
        {/* Download error outside modal                                       */}
        {/* ------------------------------------------------------------------ */}

        {downloadError &&
        !isDownloadModalOpen ? (
          <div className="mt-5">
            <ErrorState
              title="Certificate download failed"
              message={downloadError}
              onRetry={() => {
                if (
                  selectedCertificate
                ) {
                  handleConfirmDownload();
                }
              }}
              retryLabel="Try download again"
            />
          </div>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Download success feedback                                          */}
        {/* ------------------------------------------------------------------ */}

        {downloadSuccess ? (
          <div
            className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 sm:px-5"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Download
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-800">
                  Certificate downloaded successfully
                </p>

                <p className="mt-0.5 text-xs leading-5 text-emerald-700 sm:text-sm">
                  Your certificate PDF has been downloaded to your device.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default CertificatesPage;