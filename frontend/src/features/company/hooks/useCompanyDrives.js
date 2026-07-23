import { useState, useEffect, useCallback } from 'react';
import { drivesService } from '../services/drivesService';

export const useCompanyDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await drivesService.listDrives();
      
      const formatted = data.map(d => ({
        id: d.driveId,
        driveName: `${d.jobTitle} Hiring Drive`,
        role: d.jobTitle,
        candidates: d.candidateCount || 0,
        stage: d.status, // e.g. ACTIVE, PAUSED, CLOSED
        deadline: d.deadline ? new Date(d.deadline).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }) : 'TBD',
        jobTitle: d.jobTitle,
        department: d.department,
        requiredSkills: d.requiredSkills,
        salaryPackage: d.salaryPackage,
        workMode: d.workMode,
        location: d.location,
        rawDeadline: d.deadline ? d.deadline.split('T')[0] : ''
      }));
      setDrives(formatted);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recruitment drives');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const createDrive = async (driveData) => {
    try {
      const response = await drivesService.createDrive(driveData);
      await fetchDrives(); // Refresh drive list
      return response;
    } catch (err) {
      console.error('Failed to create drive:', err);
      throw err;
    }
  };

  const updateDrive = async (driveId, driveData) => {
    try {
      const response = await drivesService.updateDrive(driveId, driveData);
      await fetchDrives(); // Refresh drive list
      return response;
    } catch (err) {
      console.error('Failed to update drive:', err);
      throw err;
    }
  };

  const closeDrive = async (driveId) => {
    try {
      const response = await drivesService.closeDrive(driveId);
      await fetchDrives(); // Refresh drive list
      return response;
    } catch (err) {
      console.error('Failed to close drive:', err);
      throw err;
    }
  };

  const pauseDrive = async (driveId) => {
    try {
      const response = await drivesService.pauseDrive(driveId);
      await fetchDrives(); // Refresh drive list
      return response;
    } catch (err) {
      console.error('Failed to pause drive:', err);
      throw err;
    }
  };

  const fetchCandidates = async (driveId) => {
    try {
      return await drivesService.listCandidates(driveId);
    } catch (err) {
      console.error('Failed to fetch drive candidates:', err);
      throw err;
    }
  };

  return {
    drives,
    loading,
    error,
    createDrive,
    updateDrive,
    closeDrive,
    pauseDrive,
    fetchCandidates,
    refetch: fetchDrives
  };
};
