import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible confirmation modal with keyboard trap and backdrop dismiss.
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
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

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
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-[#0f0f0f] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <h2 id="proj-modal-title" className="text-lg font-bold text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-200 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
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
