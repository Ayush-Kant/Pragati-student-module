import { useState } from 'react';
import { Plus } from 'lucide-react';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

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
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

const toSkillObject = (skill) => {
  if (typeof skill === 'string') {
    return { name: skill };
  }
  return skill || { name: '' };
};

/**
 * A component for displaying and managing skills.
 * Shows skills as badges and allows adding/removing in edit mode.
 * Uses SkillCard for each skill.
 * @param {Object} props - The component props
 * @param {Array<string|Object>} [props.skills=[]] - Array of skill strings or objects
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onAdd] - Callback when a skill is added
 * @param {Function} [props.onRemove] - Callback when a skill is removed
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The skills section component
 */
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
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Skills"
        subtitle="Your technical and professional skills"
      />

      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No skills added yet</p>
          ) : (
            skills.map((skill, index) => (
              <SkillCard key={`${skill}-${index}`} skill={toSkillObject(skill)} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <SkillCard
                key={`${skill}-${index}`}
                skill={toSkillObject(skill)}
                isEditing={true}
                onRemove={onRemove}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new skill..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {(errors.skills || Object.keys(errors).length > 0) && (
            <p className="text-xs text-red-500">{errors.skills || 'Please check your skills'}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
