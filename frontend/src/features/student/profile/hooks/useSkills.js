import { useState, useEffect, useCallback } from 'react';
import { studentProfileService } from '../services/studentProfileService';

/**
 * Custom hook for managing skills, languages, and certifications.
 * Fetches data on mount and provides CRUD operations for skills management.
 * @returns {{
 *   skills: Array,
 *   languages: Array,
 *   certifications: Array,
 *   loading: boolean,
 *   error: string|null,
 *   addSkill: Function,
 *   removeSkill: Function,
 *   updateSkills: Function,
 *   addLanguage: Function,
 *   removeLanguage: Function,
 *   addCertification: Function,
 *   removeCertification: Function,
 *   refetch: Function
 * }}
 */
export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches skills, languages, and certifications from the service.
   * @returns {Promise<void>}
   */
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentProfileService.getSkills();
      if (response.success) {
        setSkills(response.data.skills || []);
        setCertifications(response.data.certifications || []);
        setLanguages(response.data.languages || []);
      } else {
        setError(response.error || 'Failed to fetch skills');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds a new skill to the skills list.
   * @param {string} skill - The skill to add
   */
  const addSkill = useCallback((skill) => {
    setSkills((prev) => {
      if (prev.includes(skill)) return prev;
      return [...prev, skill];
    });
  }, []);

  /**
   * Removes a skill from the skills list.
   * @param {string} skillId - The skill to remove
   */
  const removeSkill = useCallback((skillId) => {
    setSkills((prev) => prev.filter((s) => s !== skillId));
  }, []);

  /**
   * Updates all skills data via the service.
   * @param {object} data - The skills data to update
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const updateSkills = useCallback(
    async (data) => {
      try {
        const response = await studentProfileService.updateSkills(data);
        if (response.success) {
          return { success: true };
        }
        return { success: false, error: response.error || 'Failed to update skills' };
      } catch (err) {
        const errorMessage = err.message || 'An error occurred while updating skills';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  /**
   * Adds a new language to the languages list.
   * @param {string} language - The language to add
   */
  const addLanguage = useCallback((language) => {
    setLanguages((prev) => {
      if (prev.includes(language)) return prev;
      return [...prev, language];
    });
  }, []);

  /**
   * Removes a language from the languages list.
   * @param {string} languageId - The language to remove
   */
  const removeLanguage = useCallback((languageId) => {
    setLanguages((prev) => prev.filter((l) => l !== languageId));
  }, []);

  /**
   * Adds a new certification to the certifications list.
   * @param {object} certification - The certification object to add
   */
  const addCertification = useCallback((certification) => {
    setCertifications((prev) => [...prev, certification]);
  }, []);

  /**
   * Removes a certification from the certifications list.
   * @param {string} certId - The certification ID to remove
   */
  const removeCertification = useCallback((certId) => {
    setCertifications((prev) => prev.filter((c) => c.id !== certId));
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    skills,
    languages,
    certifications,
    loading,
    error,
    addSkill,
    removeSkill,
    updateSkills,
    addLanguage,
    removeLanguage,
    addCertification,
    removeCertification,
    refetch: fetchSkills
  };
};