import { studentProfileData, studentProfileApiResponse } from '../types/studentProfileDummyData.js';
import { API_ENDPOINTS } from '../constants/studentProfileConstants';

const wrapSuccess = (data) => ({ success: true, data, error: null });

const wrapError = (error) => ({ success: false, data: null, error });

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches the student profile data.
 * TODO: Replace with actual API call to GET /student/profile
 * @returns {Promise<{success: boolean, data: object, error: string | null}>}
 */
export const getStudentProfile = async () => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.GET_PROFILE);
    // return wrapSuccess(await response.json());
    return wrapSuccess(studentProfileData);
  } catch (error) {
    return wrapError(error.message || 'Failed to fetch student profile');
  }
};

/**
 * Updates the student profile with the provided data.
 * TODO: Replace with actual API call to PUT /student/profile
 * @param {Object} data - The profile data to update
 * @returns {Promise<{success: boolean, data: object, error: string | null}>}
 */
export const updateStudentProfile = async (data) => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return wrapSuccess(await response.json());
    const updatedData = { ...studentProfileData, ...data };
    return wrapSuccess(updatedData);
  } catch (error) {
    return wrapError(error.message || 'Failed to update student profile');
  }
};

/**
 * Uploads a resume file.
 * TODO: Replace with actual API call to POST /student/profile/resume
 * @param {File} file - The resume file to upload
 * @returns {Promise<{success: boolean, data: {fileUrl: string, fileName: string}, error: string | null}>}
 */
export const uploadResume = async (file) => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('resume', file);
    // const response = await fetch(API_ENDPOINTS.UPLOAD_RESUME, { method: 'POST', body: formData });
    // return wrapSuccess(await response.json());
    return wrapSuccess({
      fileUrl: URL.createObjectURL(file),
      fileName: file.name
    });
  } catch (error) {
    return wrapError(error.message || 'Failed to upload resume');
  }
};

/**
 * Uploads a document file.
 * TODO: Replace with actual API call to POST /student/profile/documents
 * @param {File} file - The document file to upload
 * @param {string} documentType - The type of document (resume, transcript, id_proof, certificate, other)
 * @returns {Promise<{success: boolean, data: {id: string, name: string, type: string, url: string}, error: string | null}>}
 */
export const uploadDocument = async (file, documentType) => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('document', file);
    // formData.append('type', documentType);
    // const response = await fetch(API_ENDPOINTS.UPLOAD_DOCUMENT, { method: 'POST', body: formData });
    // return wrapSuccess(await response.json());
    return wrapSuccess({
      id: `doc-${Date.now()}`,
      name: file.name,
      type: documentType || 'other',
      url: URL.createObjectURL(file)
    });
  } catch (error) {
    return wrapError(error.message || 'Failed to upload document');
  }
};

/**
 * Deletes a document by its ID.
 * TODO: Replace with actual API call to DELETE /student/profile/documents/:id
 * @param {string} documentId - The ID of the document to delete
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const deleteDocument = async (documentId) => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_ENDPOINTS.DELETE_DOCUMENT}/${documentId}`, { method: 'DELETE' });
    // return wrapSuccess(await response.json());
    return wrapSuccess(true);
  } catch (error) {
    return wrapError(error.message || 'Failed to delete document');
  }
};

/**
 * Gets the profile completion percentage and steps.
 * TODO: Replace with actual API call to GET /student/profile/completion
 * @returns {Promise<{success: boolean, data: {percentage: number, steps: Array}, error: string | null}>}
 */
export const getProfileCompletion = async () => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.GET_COMPLETION);
    // return wrapSuccess(await response.json());
    return wrapSuccess({
      percentage: studentProfileData.profileCompletion,
      steps: [
        { id: 'personal', label: 'Personal Information', completed: true, required: true },
        { id: 'contact', label: 'Contact Details', completed: true, required: true },
        { id: 'address', label: 'Address Information', completed: false, required: true },
        { id: 'academic', label: 'Academic Information', completed: true, required: true },
        { id: 'skills', label: 'Skills & Certifications', completed: false, required: true },
        { id: 'documents', label: 'Documents', completed: false, required: false },
        { id: 'social', label: 'Social Profiles', completed: false, required: false }
      ]
    });
  } catch (error) {
    return wrapError(error.message || 'Failed to fetch profile completion');
  }
};

/**
 * Gets the skills, languages, and certifications list.
 * TODO: Replace with actual API call to GET /student/profile/skills
 * @returns {Promise<{success: boolean, data: {skills: Array, languages: Array, certifications: Array}, error: string | null}>}
 */
export const getSkills = async () => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.GET_SKILLS);
    // return wrapSuccess(await response.json());
    return wrapSuccess({
      skills: studentProfileData.skills,
      languages: studentProfileData.languages,
      certifications: studentProfileData.certifications
    });
  } catch (error) {
    return wrapError(error.message || 'Failed to fetch skills');
  }
};

/**
 * Updates the skills, languages, and certifications.
 * TODO: Replace with actual API call to PUT /student/profile/skills
 * @param {Object} data - The skills data to update
 * @returns {Promise<{success: boolean, data: object, error: string | null}>}
 */
export const updateSkills = async (data) => {
  try {
    await simulateDelay();
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.UPDATE_SKILLS, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return wrapSuccess(await response.json());
    return wrapSuccess(data);
  } catch (error) {
    return wrapError(error.message || 'Failed to update skills');
  }
};