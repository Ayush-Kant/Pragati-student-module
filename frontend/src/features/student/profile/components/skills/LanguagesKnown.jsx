import { useState } from 'react';
import { Languages, Plus, X } from 'lucide-react';

const validateLanguages = (languages) => {
  const errors = {};
  if (!Array.isArray(languages)) {
    errors.languages = 'Languages must be an array';
    return errors;
  }
  if (languages.length === 0) {
    errors.languages = 'At least one language is required';
  }
  if (languages.length > 10) {
    errors.languages = 'Maximum 10 languages allowed';
  }
  const invalidLanguages = languages.filter(
    (lang) => typeof lang !== 'string' || lang.trim().length < 2 || lang.trim().length > 30
  );
  if (invalidLanguages.length > 0) {
    errors.languages = 'Each language must be a string between 2 and 30 characters';
  }
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const LanguagesKnown = ({ languages = [], isEditing = false, onAdd, onRemove, validationErrors = {} }) => {
  const [newLanguage, setNewLanguage] = useState('');
  const [localErrors, setLocalErrors] = useState({});

  const handleAdd = () => {
    const trimmed = newLanguage.trim();
    if (!trimmed) return;
    const currentLanguages = Array.isArray(languages) ? languages : [];
    const testLanguages = [...currentLanguages, trimmed];
    const errors = validateLanguages(testLanguages);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }
    setLocalErrors({});
    onAdd && onAdd(trimmed);
    setNewLanguage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Languages Known" subtitle="Languages you can communicate in" />
      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {languages.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No languages added yet</p>
          ) : (
            languages.map((language, index) => (
              <span key={`${language}-${index}`} className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-sm font-medium text-teal-400">
                <Languages className="h-3.5 w-3.5" />
                {language}
              </span>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <span key={`${language}-${index}`} className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-sm font-medium text-teal-400">
                <Languages className="h-3.5 w-3.5" />
                {language}
                <button type="button" onClick={() => onRemove && onRemove(language)} className="rounded-full p-0.5 hover:bg-teal-500/20 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new language..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white/5 text-white"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505]"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {(errors.languages || Object.keys(errors).length > 0) && (
            <p className="text-xs text-red-400">{errors.languages || 'Please check your languages'}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguagesKnown;
