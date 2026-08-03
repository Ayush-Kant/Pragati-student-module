import { useState, useCallback, useEffect, useRef } from 'react';
import { studentProfileService } from '../services/studentProfileService';

/**
 * Custom hook for managing document uploads.
 * Handles resume and document uploads with simulated progress tracking.
 * @returns {{
 *   uploading: boolean,
 *   uploadProgress: number,
 *   error: string|null,
 *   documents: Array,
 *   uploadResume: Function,
 *   uploadDocument: Function,
 *   deleteDocument: Function,
 *   refetch: Function
 * }}
 */
export const useDocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const progressInterval = useRef(null);

  /**
   * Simulates upload progress using setInterval.
   * @param {Function} onComplete - Callback when progress reaches 100
   */
  const simulateProgress = useCallback((onComplete) => {
    setUploadProgress(0);
    let progress = 0;
    progressInterval.current = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        setUploadProgress(progress);
        clearInterval(progressInterval.current);
        progressInterval.current = null;
        if (onComplete) onComplete();
      } else {
        setUploadProgress(progress);
      }
    }, 200);
  }, []);

  /**
   * Clears the progress interval on unmount.
   */
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  /**
   * Uploads a resume file.
   * @param {File} file - The resume file to upload
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const uploadResume = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await new Promise((resolve) => {
        simulateProgress(() => {
          studentProfileService.uploadResume(file).then(resolve);
        });
      });

      if (response.success) {
        setDocuments((prev) => [
          {
            id: `resume-${Date.now()}`,
            name: file.name,
            fileName: file.name,
            type: 'resume',
            url: response.data.fileUrl,
            size: file.size,
            uploadedAt: new Date().toISOString()
          },
          ...prev
        ]);
        setUploadProgress(100);
        return { success: true, data: response.data };
      }

      const errorMessage = response.error || 'Failed to upload resume';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload resume';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, [simulateProgress]);

  /**
   * Uploads a document file of the specified type.
   * @param {File} file - The document file to upload
   * @param {string} type - The document type (resume, transcript, id_proof, certificate, other)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const uploadDocument = useCallback(async (file, type) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await new Promise((resolve) => {
        simulateProgress(() => {
          studentProfileService.uploadDocument(file, type).then(resolve);
        });
      });

      if (response.success) {
        setDocuments((prev) => [...prev, response.data]);
        setUploadProgress(100);
        return { success: true, data: response.data };
      }

      const errorMessage = response.error || 'Failed to upload document';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload document';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, [simulateProgress]);

  /**
   * Deletes a document by its ID.
   * @param {string} documentId - The ID of the document to delete
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteDocument = useCallback(async (documentId) => {
    setError(null);
    try {
      const response = await studentProfileService.deleteDocument(documentId);
      if (response.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete document' };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete document';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Fetches the list of documents from the service.
   * @returns {Promise<void>}
   */
  const refetch = useCallback(async () => {
    try {
      const response = await studentProfileService.getStudentProfile();
      if (response.success && response.data.documents) {
        setDocuments(response.data.documents);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch documents');
    }
  }, []);

  return {
    uploading,
    uploadProgress,
    error,
    documents,
    uploadResume,
    uploadDocument,
    deleteDocument,
    refetch
  };
};