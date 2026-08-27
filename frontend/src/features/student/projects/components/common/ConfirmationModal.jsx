import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible confirmation modal with a proper keyboard focus trap.
 *
 * Focus behaviour:
 *  - On open: focus moves to the first focusable element inside the modal.
 *  - Tab: cycles forward through focusable elements, wrapping at the end.
 *  - Shift+Tab: cycles backward, wrapping at the start.
 *  - Escape: closes the modal.
 *  - On close: focus returns to the element that triggered the modal.
 *
 * @param {{
 *   isOpen: boolean,
 *   title: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   onConfirm: Function,
 *   onCancel: Function,
 *   isLoading?: boolean,
 *   variant?: 'primary'|'danger',
 * }} props
 */
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'primary',
}) => {
  const dialogRef = useRef(null);
  // Remember the element that had focus before the modal opened
  const previousFocusRef = useRef(null);

  // ── Focus trap helpers ────────────────────────────────────────────────────

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return [];
    return Array.from(
      dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  // ── Open / close lifecycle ─────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element so we can restore it on close
      previousFocusRef.current = document.activeElement;

      // Give the DOM a tick to render before attempting to focus
      const raf = requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          // Fallback: focus the dialog itself
          dialogRef.current?.focus();
        }
      });

      return () => cancelAnimationFrame(raf);
    } else {
      // Restore focus to the previously focused element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, getFocusableElements]);

  // ── Keyboard handler ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        if (focusable.length === 1) {
          // Only one focusable element — keep focus on it
          e.preventDefault();
          focusable[0].focus();
          return;
        }

        const firstEl = focusable[0];
        const lastEl  = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: if at the first element, wrap to last
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // Tab: if at the last element, wrap to first
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, getFocusableElements]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  const confirmClasses =
    variant === 'danger'
      ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30 hover:shadow-red-500/50'
      : 'bg-gradient-to-r from-violet-500 to-violet-600 shadow-violet-500/30 hover:shadow-violet-500/50';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proj-modal-title"
      aria-describedby="proj-modal-message"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog panel — tabIndex={-1} allows programmatic focus as fallback */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-[#0f0f0f] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in focus:outline-none"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <h2 id="proj-modal-title" className="text-lg font-bold text-gray-100 mb-2">
          {title}
        </h2>
        <p id="proj-modal-message" className="text-gray-400 text-sm mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label={cancelLabel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-200 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            aria-label={isLoading ? 'Processing, please wait' : confirmLabel}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100 ${confirmClasses}`}
          >
            {isLoading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
