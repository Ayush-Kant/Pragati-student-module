import { getLevelColor } from '../../../utils/studentProfileHelpers';

/**
 * A skill card component that displays a single skill with optional level.
 * Shows remove button only when isEditing is true.
 * @param {Object} props - The component props
 * @param {Object} props.skill - The skill object with name and optional level
 * @param {string} props.skill.name - The skill name
 * @param {string} [props.skill.level] - Optional skill level (Beginner, Intermediate, Advanced, Expert)
 * @param {Function} [props.onRemove] - Callback when remove button is clicked
 * @param {boolean} [props.isEditing=false] - Whether the skill card is in edit mode
 * @returns {JSX.Element} The skill card component
 */
const SkillCard = ({ skill, onRemove, isEditing = false }) => {
  if (!skill || typeof skill !== 'object') {
    return null;
  }

  const skillName = skill.name || skill;
  const skillLevel = skill.level || '';
  const levelColor = skillLevel ? getLevelColor(skillLevel) : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-orange-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{skillName}</span>
      {skillLevel && (
        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${levelColor}`}>
          {skillLevel}
        </span>
      )}
      {isEditing && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SkillCard;
