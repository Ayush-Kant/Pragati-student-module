import api from '../../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

const request = async (promise) => {
  try {
    const response = await promise;
    return { success: true, data: unwrap(response), error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error?.response?.data?.message || error?.message || 'Request failed.',
    };
  }
};

export const getCodingChallenges = () => request(api.get('/student/coding'));

export const getChallengeDetails = (challengeId) =>
  request(api.get(`/student/coding/${challengeId}`));

export const executeCode = (payload) =>
  request(api.post(`/student/coding/${payload.challengeId}/run`, payload));

export const submitSolution = (payload) =>
  request(api.post(`/student/coding/${payload.challengeId}/submit`, payload));

export const getSubmissionHistory = (challengeId = null) =>
  request(
    challengeId
      ? api.get(`/student/coding/${challengeId}/submissions`)
      : api.get('/student/coding/submissions'),
  );

export const getLeaderboard = (challengeId = null) =>
  request(
    challengeId
      ? api.get(`/student/coding/${challengeId}/leaderboard`)
      : api.get('/student/coding/leaderboard'),
  );

const codingChallengeService = {
  getCodingChallenges,
  getChallengeDetails,
  executeCode,
  submitSolution,
  getSubmissionHistory,
  getLeaderboard,
};

export default codingChallengeService;
