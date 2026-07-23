import { useCallback, useEffect, useState } from "react";
import { getRecordings, downloadRecording } from "../services/liveSessionService";

/**
 * Fetches recordings and exposes a download action.
 * Responsibilities: fetch recordings, download recording, loading/error state.
 */
export function useRecordings() {
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchRecordings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getRecordings();
    if (result.success) {
      setRecordings(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const download = useCallback(async (sessionId) => {
    setDownloadingId(sessionId);
    const result = await downloadRecording(sessionId);
    if (result.success && typeof window !== "undefined") {
      const link = document.createElement("a");
      link.href = result.data.url;
      link.download = result.data.filename || "recording.mp4";
      link.rel = "noopener noreferrer";
      link.click();
    }
    setDownloadingId(null);
    return result;
  }, []);

  return {
    recordings,
    isLoading,
    error,
    refetch: fetchRecordings,
    download,
    isDownloading: (id) => downloadingId === id,
  };
}
