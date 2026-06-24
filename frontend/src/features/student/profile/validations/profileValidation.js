// validation.jsx
// Utility URL Validation patterns and inline Error Banner components

import React from 'react';

/**
 * Validates student professional links using regex patterns
 * @param {Object} links - Object containing github, linkedin, and website strings
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSocialLinks = (links) => {
  const errors = {};
  
  // Robust regex standard URL matcher
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

  if (links.github && !urlRegex.test(links.github)) {
    errors.github = "Please enter a valid GitHub URL (e.g., https://github.com/username)";
  }
  if (links.linkedin && !urlRegex.test(links.linkedin)) {
    errors.linkedin = "Please enter a valid LinkedIn profile link";
  }
  if (links.website && !urlRegex.test(links.website)) {
    errors.website = "Please enter a valid website portfolio domain URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates project creation parameters inside the CRUD panel
 * @param {Object} project - Object containing title and description
 */
export const validateProjectEntry = (project) => {
  const errors = {};

  if (!project.title || !project.title.trim()) {
    errors.title = "Project title is mandatory.";
  }
  if (!project.description || !project.description.trim()) {
    errors.description = "Project description is mandatory.";
  } else if (project.description.trim().length < 20) {
    errors.description = "Description must be a brief summary of at least 20 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Presentational UI component to display validation alerts neatly
 */
export const ValidationAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl mt-1.5 animate-fadeIn">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};