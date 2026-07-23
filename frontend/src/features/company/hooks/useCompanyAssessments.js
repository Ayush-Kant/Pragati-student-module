import { useState, useEffect, useCallback } from 'react';
import { assessmentsService } from '../services/assessmentsService';

export const useCompanyAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await assessmentsService.list();
      
      // Map database row keys to UI-expected keys
      const formatted = data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type || 'Technical',
        difficulty: item.difficulty || 'Medium',
        duration: `${item.time_limit_minutes || 60} mins`,
        time_limit_minutes: item.time_limit_minutes || 60,
        total_marks: item.total_marks || 100,
        candidates: 0 // Mock count or calculated
      }));

      setAssessments(formatted);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const createAssessment = async (data) => {
    try {
      await assessmentsService.create(data);
      await fetchAssessments();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateAssessment = async (id, data) => {
    try {
      await assessmentsService.update(id, data);
      await fetchAssessments();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const archiveAssessment = async (id) => {
    try {
      await assessmentsService.archive(id);
      await fetchAssessments();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const assignAssessmentToDrive = async (id, driveId) => {
    try {
      await assessmentsService.assignToDrive(id, driveId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    assessments,
    loading,
    error,
    refreshAssessments: fetchAssessments,
    createAssessment,
    updateAssessment,
    archiveAssessment,
    assignAssessmentToDrive
  };
};
