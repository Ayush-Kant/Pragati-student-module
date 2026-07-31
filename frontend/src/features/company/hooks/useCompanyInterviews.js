import { useState, useEffect, useCallback } from 'react';
import { interviewsService } from '../services/interviewsService';

export const useCompanyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await interviewsService.list();
      
      const formatted = data.map(item => {
        const initials = item.candidateName
          ? item.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()
          : 'C';
        const avatarClass = item.candidateName
          ? `avatar-${item.candidateName.split(' ').map(n => n[0]).join('').toLowerCase()}`
          : 'avatar-c';
        
        let dateStr = 'TBD';
        let timeStr = 'TBD';
        if (item.scheduledAt) {
          const d = new Date(item.scheduledAt);
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          }
        }

        const roundType = item.round.toLowerCase().includes('hr') 
          ? 'hr' 
          : item.round.toLowerCase().includes('final') || item.round.toLowerCase().includes('managerial')
            ? 'final' 
            : 'technical';

        const statusLabel = item.status === 'scheduled' 
          ? 'Scheduled' 
          : item.status === 'completed' 
            ? 'Completed' 
            : 'No Show';

        const resultLabel = item.result === 'PASS' 
          ? 'Pass' 
          : item.result === 'FAIL' 
            ? 'Fail' 
            : null;

        return {
          id: item.id,
          candidate: item.candidateName,
          initials,
          avatarClass,
          interviewer: item.interviewerName || 'Unassigned',
          date: dateStr,
          time: timeStr,
          round: item.round,
          roundType,
          status: statusLabel,
          result: resultLabel,
          meetingLink: item.meetingLink,
          feedback: item.feedback,
          applicationId: item.applicationId
        };
      });

      setInterviews(formatted);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const scheduleInterview = async (data) => {
    try {
      await interviewsService.create(data);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const submitFeedback = async (id, feedbackText) => {
    try {
      await interviewsService.submitFeedback(id, feedbackText);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateResult = async (id, result, attendance) => {
    try {
      await interviewsService.updateResult(id, result, attendance);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    interviews,
    loading,
    error,
    refreshInterviews: fetchInterviews,
    scheduleInterview,
    submitFeedback,
    updateResult
  };
};
