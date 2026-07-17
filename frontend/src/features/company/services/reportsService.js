import api from '../../../services/api';
import toast from 'react-hot-toast';

export const reportsService = {
  getKPIs: async () => {
    try {
      const response = await api.get('/v1/company/reports/kpis');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports KPIs:', error);
      throw error;
    }
  },

  getFunnel: async () => {
    try {
      const response = await api.get('/v1/company/reports/funnel');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports funnel:', error);
      throw error;
    }
  },

  getTrends: async () => {
    try {
      const response = await api.get('/v1/company/reports/trends');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports trends:', error);
      throw error;
    }
  },

  getCollegePerformance: async () => {
    try {
      const response = await api.get('/v1/company/reports/college-performance');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports college performance:', error);
      throw error;
    }
  },

  exportPerformanceReport: async () => {
    try {
      const response = await api.get('/v1/company/reports/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'college_performance_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Performance report CSV downloaded successfully!');
    } catch (error) {
      console.error('Error exporting performance report:', error);
      toast.error('Failed to export performance report CSV');
      throw error;
    }
  }
};
