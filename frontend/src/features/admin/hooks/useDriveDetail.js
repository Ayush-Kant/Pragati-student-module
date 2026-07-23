import { useCallback, useEffect, useState } from "react";

import { getDriveById, getCandidates } from "../services/adminService";

const useDriveDetail = (driveId) => {
  const [drive, setDrive] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrive = useCallback(async () => {
    try {
      const data = await getDriveById(driveId);
      setDrive(data);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }, [driveId]);

  const fetchCandidates = useCallback(async () => {
    try {
      const data = await getCandidates(driveId);
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }, [driveId]);

  const refreshDrive = async () => {
    await fetchDrive();
  };

  const refreshCandidates = async () => {
    await fetchCandidates();
  };

  const refreshAll = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchDrive(), fetchCandidates()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, [driveId]);

  return {
    drive,
    candidates,

    loading,
    error,

    refreshDrive,
    refreshCandidates,
    refreshAll,
  };
};

export default useDriveDetail;
