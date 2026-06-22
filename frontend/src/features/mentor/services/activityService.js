import axios from 'axios';

const getToken = () => localStorage.getItem('token');

export const getActivities = () =>
  axios.get('/api/mentor/assessments', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

export const createActivity = (data) =>
  axios.post('/api/mentor/assessments', data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
