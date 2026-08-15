// src/features/student/placement/components/common/ConfirmationModal.jsx
import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

/**
 * Reusable Confirmation Modal
 * @param {boolean} isOpen - Whether modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Confirmation prompt text
 * @param {string} [confirmLabel='Confirm'] - Action button text
 * @param {string} [cancelLabel='Cancel'] - Cancel button text
 * @param {string} [variant='primary'] - 'primary' | 'danger'
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onClose - Close / cancel callback
 * @param {boolean} [isLoading=false] - Loading state on confirm button
 */
export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onClose,
  isLoading = false,
}) {
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-surface-100 overflow-hidden transform transition-all animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDanger ? 'bg-rose-100 text-rose-600' : 'bg-primary-100 text-primary-600'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 id="modal-title" className="text-base font-semibold text-surface-900">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-surface-400 hover:text-surface-600 p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-sm text-surface-600 leading-relaxed">
          {message}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-surface-50 border-t border-surface-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={isDanger ? 'btn-danger' : 'btn-primary'}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
