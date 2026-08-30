import {
  AlertTriangle,
  X,
} from "lucide-react";

/**
 * Reusable confirmation modal.
 *
 * Responsive behavior:
 * - Mobile: bottom-aligned modal for easier thumb interaction.
 * - md/lg: centered modal with controlled width.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.confirmLabel
 * @param {string} props.cancelLabel
 * @param {Function} props.onConfirm
 * @param {Function} props.onCancel
 * @param {boolean} props.loading
 * @param {string} props.loadingLabel
 * @param {React.ReactNode} props.icon
 * @param {"default"|"danger"} props.variant
 * @returns {JSX.Element|null}
 */
const ConfirmationModal = ({
  isOpen = false,
  title = "Confirm action",
  description = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  loadingLabel = "Processing...",
  icon = null,
  variant = "default",
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmStyles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-200"
      : "bg-slate-900 hover:bg-slate-800 focus:ring-slate-300";

  const handleBackdropClick = (
    event
  ) => {
    if (
      event.target === event.currentTarget &&
      !loading &&
      typeof onCancel === "function"
    ) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-confirmation-title"
        aria-describedby="certificate-confirmation-description"
        className="w-full max-w-lg overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:h-11 sm:w-11">
              {icon || (
                <AlertTriangle
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <h2
                id="certificate-confirmation-title"
                className="text-base font-bold text-slate-900 sm:text-lg"
              >
                {title}
              </h2>

              <p
                id="certificate-confirmation-description"
                className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6"
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={
                loading ||
                typeof onConfirm !==
                  "function"
              }
              className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${confirmStyles}`}
            >
              {loading ? (
                <>
                  <span
                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />

                  <span>{loadingLabel}</span>
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;