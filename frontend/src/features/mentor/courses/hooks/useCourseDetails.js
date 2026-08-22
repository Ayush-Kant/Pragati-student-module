import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourseDetails } from '../services/courseService';

export const useCourseDetails = (courseId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError(null);
      const course = await getCourseDetails(courseId);
      setData(course);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to fetch course details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  return { data, loading, error, refetch: fetchCourse };
};
