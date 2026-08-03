import { studentProfileData, studentProfileApiResponse } from '../types/studentProfileDummyData.js';
import { API_ENDPOINTS } from '../constants/studentProfileConstants';

const wrapSuccess = (data) => ({ success: true, data, error: null });

const wrapError = (error) => ({ success: false, data: null, error });

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getStudentProfile = async () => {
  try {
    await simulateDelay();
    return wrapSuccess(studentProfileData);
  } catch (error) {
    return wrapError(error.message || 'Failed to fetch student profile');
  }
};

export const updateStudentProfile = async (data) => {
  try {
    await simulateDelay();
    const updatedData = { ...studentProfileData, ...data };
    return wrapSuccess(updatedData);
  } catch (error) {
    return wrapError(error.message || 'Failed to update student profile');
  }
};

export const uploadResume = async (file) => {
  try {
    await simulateDelay();
    return wrapSuccess({
      fileUrl: URL.createObjectURL(file),
      fileName: file.name
    });
  } catch (error) {
    return wrapError(error.message || 'Failed to upload resume');
  }
};

export const uploadDocument = async (file, documentType) => {
  try {
    await simulateDelay();
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

export const deleteDocument = async (documentId) => {
  try {
    await simulateDelay();
    return wrapSuccess(true);
  } catch (error) {
    return wrapError(error.message || 'Failed to delete document');
  }
};

export const getProfileCompletion = async () => {
  try {
    await simulateDelay();
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

export const getSkills = async () => {
  try {
    await simulateDelay();
    return wrapSuccess({
      skills: studentProfileData.skills,
      languages: studentProfileData.languages,
      certifications: studentProfileData.certifications
    });
  } catch (error) {
    return wrapError(error.message || 'Failed to fetch skills');
  }
};

export const updateSkills = async (data) => {
  try {
    await simulateDelay();
    return wrapSuccess(data);
  } catch (error) {
    return wrapError(error.message || 'Failed to update skills');
  }
};

export const studentProfileService = {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  uploadDocument,
  deleteDocument,
  getProfileCompletion,
  getSkills,
  updateSkills
};
