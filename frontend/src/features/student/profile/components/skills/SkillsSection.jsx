import { useState } from 'react';
import { Plus } from 'lucide-react';

const validateSkills = (skills) => {
  const errors = {};
  if (!Array.isArray(skills)) {
    errors.skills = 'Skills must be an array';
    return errors;
  }
  if (skills.length === 0) {
    errors.skills = 'At least one skill is required';
  }
  if (skills.length > 20) {
    errors.skills = 'Maximum 20 skills allowed';
  }
  const invalidSkills = skills.filter(
    (skill) => {
      const name = typeof skill === 'string' ? skill : skill?.name;
      return !name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50;
    }
  );
  if (invalidSkills.length > 0) {
    errors.skills = 'Each skill must be a string between 2 and 50 characters';
  }
  const emptySkills = skills.filter((skill) => {
    const name = typeof skill === 'string' ? skill : skill?.name;
    return typeof name === 'string' && name.trim() === '';
  });
  if (emptySkills.length > 0) {
    errors.skills = 'Skills must not contain empty strings';
  }
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const SkillsSection = ({ skills = [], isEditing = false, onAdd, onRemove, validationErrors = {} }) => {
  const [newSkill, setNewSkill] = useState('');
  const [localErrors, setLocalErrors] = useState({});

  const handleAdd = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    const currentSkills = Array.isArray(skills) ? skills : [];
    const testSkills = [...currentSkills, trimmed];
    const errors = validateSkills(testSkills);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }
    setLocalErrors({});
    onAdd && onAdd(trimmed);
    setNewSkill('');
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
      <SectionHeader title="Skills" subtitle="Your technical and professional skills" />
      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No skills added yet</p>
          ) : (
            skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="inline-flex items-center rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-400">
                {typeof skill === 'string' ? skill : skill?.name}
              </span>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-400">
                {typeof skill === 'string' ? skill : skill?.name}
                <button type="button" onClick={() => onRemove && onRemove(skill)} className="rounded-full p-0.5 hover:bg-orange-500/20 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new skill..."
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
          {(errors.skills || Object.keys(errors).length > 0) && (
            <p className="text-xs text-red-400">{errors.skills || 'Please check your skills'}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
