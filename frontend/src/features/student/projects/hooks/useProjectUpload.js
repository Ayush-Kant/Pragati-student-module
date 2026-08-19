/**
 * useProjectUpload — manages drag-and-drop file upload state for a project.
 * All upload logic (validation, progress, retry, cancel, remove) lives here.
 */

import { useCallback, useRef, useState } from 'react';
import { uploadProjectFile, deleteProjectFile } from '../services/projectService';
import { validateFileBatch } from '../validations/projectValidation';
import {
  createFileEntry,
  startUpload,
  updateProgress,
  markUploadSuccess,
  markUploadError,
  markUploadCancelled,
  computeTotalBytes,
} from '../utils/submissionHelpers';
import { UPLOAD_STATE } from '../constants/projectConstants';

/**
 * @param {string} projectId
 * @returns {{
 *   fileEntries: object[],
 *   isDragging: boolean,
 *   validationErrors: string[],
 *   addFiles: (files: FileList | File[]) => void,
 *   removeFile: (localId: string) => void,
 *   retryUpload: (localId: string) => void,
 *   cancelUpload: (localId: string) => void,
 *   clearAll: () => void,
 *   onDragOver: Function,
 *   onDragLeave: Function,
 *   onDrop: Function,
 * }}
 */
export function useProjectUpload(projectId) {
  const [fileEntries, setFileEntries]       = useState([]);
  const [isDragging, setIsDragging]         = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // AbortController refs keyed by localId
  const abortRefs = useRef({});

  // ── Internal: upload a single file entry ──────────────────────────────────

  const uploadEntry = useCallback(
    async (localId, file) => {
      const controller = new AbortController();
      abortRefs.current[localId] = controller;

      setFileEntries((prev) =>
        prev.map((e) => (e.id === localId ? startUpload(e) : e))
      );

      try {
        const result = await uploadProjectFile(projectId, file, {
          onProgress: (pct) => {
            // Check if cancelled before updating
            if (controller.signal.aborted) return;
            setFileEntries((prev) =>
              prev.map((e) => (e.id === localId ? updateProgress(e, pct) : e))
            );
          },
        });

        if (controller.signal.aborted) return;

        if (result.success) {
          setFileEntries((prev) =>
            prev.map((e) =>
              e.id === localId ? markUploadSuccess(e, result.data.id) : e
            )
          );
        } else {
          setFileEntries((prev) =>
            prev.map((e) =>
              e.id === localId ? markUploadError(e, result.error) : e
            )
          );
        }
      } catch {
        if (controller.signal.aborted) return;
        setFileEntries((prev) =>
          prev.map((e) =>
            e.id === localId
              ? markUploadError(e, 'Upload failed unexpectedly.')
              : e
          )
        );
      } finally {
        delete abortRefs.current[localId];
      }
    },
    [projectId]
  );

  // ── Public API ─────────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (files) => {
      const fileArray = Array.from(files ?? []);
      const existingBytes = computeTotalBytes(fileEntries);
      const validation = validateFileBatch(fileArray, existingBytes);

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }

      setValidationErrors([]);

      const newEntries = fileArray.map((f) => createFileEntry(f));
      setFileEntries((prev) => [...prev, ...newEntries]);

      // Kick off uploads
      for (const entry of newEntries) {
        uploadEntry(entry.id, entry.file);
      }
    },
    [fileEntries, uploadEntry]
  );

  const removeFile = useCallback(
    async (localId) => {
      // Cancel in-flight upload if running
      abortRefs.current[localId]?.abort();

      const entry = fileEntries.find((e) => e.id === localId);

      // If already uploaded to server, delete it
      if (entry?.uploadedFileId) {
        await deleteProjectFile(projectId, entry.uploadedFileId);
      }

      setFileEntries((prev) => prev.filter((e) => e.id !== localId));
    },
    [fileEntries, projectId]
  );

  const retryUpload = useCallback(
    (localId) => {
      const entry = fileEntries.find((e) => e.id === localId);
      if (!entry || entry.state !== UPLOAD_STATE.ERROR) return;
      uploadEntry(localId, entry.file);
    },
    [fileEntries, uploadEntry]
  );

  const cancelUpload = useCallback(
    (localId) => {
      abortRefs.current[localId]?.abort();
      setFileEntries((prev) =>
        prev.map((e) => (e.id === localId ? markUploadCancelled(e) : e))
      );
    },
    []
  );

  const clearAll = useCallback(() => {
    // Abort all in-flight
    Object.values(abortRefs.current).forEach((ctrl) => ctrl.abort());
    abortRefs.current = {};
    setFileEntries([]);
    setValidationErrors([]);
  }, []);

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return {
    fileEntries,
    isDragging,
    validationErrors,
    addFiles,
    removeFile,
    retryUpload,
    cancelUpload,
    clearAll,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
