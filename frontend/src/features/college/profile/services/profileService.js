import { profileDummyData } from '../types/profileDummyData';

// Base API URL configuration routing target for the college profile data
const API_BASE_URL = '/api/v1/college/profile';

// Toggle flag to switch between mock environment and live backend integration pipelines
const USE_DUMMY_DATA = true;

export const profileService = {
  /**
   * Fetches core college institution profile metrics and contact details.
   * @returns {Promise<Object>} Clean JSON payload matching college parameters
   */
  fetchCollegeProfile: async () => { // Changed name to clearly state it fetches College data
    if (USE_DUMMY_DATA) {
      // Emulate subtle network latency overhead for operational realism in UI
      return new Promise((resolve) => setTimeout(() => resolve(profileDummyData), 600));
    }

    // Changing this to '/details' or leaving it as '/me' depends on your backend routes. 
    // Usually, public/admin profiles use a structural endpoint like '/details'.
    const response = await fetch(`${API_BASE_URL}/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error(`College profile fetching failed with status: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Updates college administrative details back to the system core server.
   * @param {Object} updatedFields Payload dictionary containing modified state data keys
   * @returns {Promise<Object>} API transaction confirmation response
   */
  updateCollegeProfile: async (updatedFields) => { // Changed name to reflect College profile updates
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, data: updatedFields }), 500));
    }

    const response = await fetch(`${API_BASE_URL}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updatedFields)
    });

    if (!response.ok) {
      throw new Error(`College profile update failed with status: ${response.status}`);
    }

    return await response.json();
  }
};
