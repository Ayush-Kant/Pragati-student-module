import { History } from "lucide-react";

import HistoryCard from "./HistoryCard";
import DownloadHistory from "./DownloadHistory";

import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import LoadingSpinner from "../common/LoadingSpinner";
import SectionHeader from "../common/SectionHeader";

/**
 * Certificate history section.
 *
 * Displays:
 * - Previously issued certificates
 * - Certificate status
 * - Certificate verification status
 * - Download history
 *
 * @param {Object} props
 * @param {Array} props.history
 * @param {Array} props.downloadHistory
 * @param {boolean} props.loading
 * @param {boolean} props.historyLoading
 * @param {boolean} props.downloadHistoryLoading
 * @param {string|null} props.error
 * @param {string|null} props.historyError
 * @param {string|null} props.downloadHistoryError
 * @param {Function} props.onRetry
 * @param {Function} props.onRetryHistory
 * @param {Function} props.onRetryDownloadHistory
 * @param {Function} props.onView
 * @param {string} props.className
 * @returns {JSX.Element}
 */
const CertificateHistory = ({
  history = [],
  downloadHistory = [],
  loading = false,
  historyLoading = false,
  downloadHistoryLoading = false,
  error = null,
  historyError = null,
  downloadHistoryError = null,
  onRetry,
  onRetryHistory,
  onRetryDownloadHistory,
  onView,
  className = "",
}) => {
  const certificateHistoryLoading =
    loading || historyLoading;

  const certificateHistoryError =
    historyError || error;

  return (
    <section
      className={`w-full ${className}`}
      aria-label="Certificate history"
    >
      <SectionHeader
        eyebrow="Activity"
        title="Certificate History"
        description="View your previously issued certificates and recent download activity."
      />

      {/* Certificate history */}
      <div className="mt-5">
        {certificateHistoryLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 shadow-sm sm:px-5 sm:py-10">
            <LoadingSpinner
              size="md"
              label="Loading certificate history..."
            />
          </div>
        ) : certificateHistoryError ? (
          <ErrorState
            title="Unable to load certificate history"
            message={certificateHistoryError}
            onRetry={
              typeof onRetryHistory === "function"
                ? onRetryHistory
                : onRetry
            }
            retryLabel="Try again"
          />
        ) : !Array.isArray(history) ||
          history.length === 0 ? (
          <EmptyState
            icon={History}
            title="No certificate history"
            description="Your previously issued certificates will appear here once they are available."
          />
        ) : (
          <div className="space-y-3">
            {history.map(
              (historyItem, index) => (
                <HistoryCard
                  key={
                    historyItem?.id ||
                    historyItem?.certificateId ||
                    `history-${index}`
                  }
                  historyItem={historyItem}
                  onView={onView}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Download history */}
      <div className="mt-8 sm:mt-10">
        {downloadHistoryLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 shadow-sm sm:px-5 sm:py-10">
            <LoadingSpinner
              size="md"
              label="Loading download history..."
            />
          </div>
        ) : downloadHistoryError ? (
          <ErrorState
            title="Unable to load download history"
            message={downloadHistoryError}
            onRetry={
              onRetryDownloadHistory
            }
            retryLabel="Try again"
          />
        ) : (
          <DownloadHistory
            downloadHistory={
              Array.isArray(
                downloadHistory
              )
                ? downloadHistory
                : []
            }
          />
        )}
      </div>
    </section>
  );
};

export default CertificateHistory;