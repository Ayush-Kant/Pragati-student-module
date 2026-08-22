import { useEffect } from 'react';

/**
 * Warns the user before navigating away when there is unsaved code.
 *
 * Attaches a `beforeunload` handler when `isDirty` is true and cleans it
 * up on unmount or when `isDirty` becomes false.
 *
 * @param {boolean} isDirty - Whether the editor has unsaved changes.
 * @param {string} [message] - Custom warning message (browsers may ignore custom messages).
 */
export function useBeforeUnload(isDirty, message = 'You have unsaved code. Are you sure you want to leave?') {
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      // Chrome requires returnValue to be set; other browsers use the return value.
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);
}
