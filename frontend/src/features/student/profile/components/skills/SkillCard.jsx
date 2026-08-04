import { getLevelColor } from '../../utils/studentProfileHelpers';

const SkillCard = ({ skill, onRemove, isEditing = false }) => {
  if (!skill || typeof skill !== 'object') {
    return null;
  }

  const skillName = skill.name || skill;
  const skillLevel = skill.level || '';
  const levelColor = skillLevel ? getLevelColor(skillLevel) : 'text-gray-400';

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 shadow-sm transition-all hover:border-orange-500/50 dark:bg-orange-900/20">
      <span className="text-sm font-medium text-orange-400">{skillName}</span>
      {skillLevel && (
        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${levelColor}`}>
          {skillLevel}
        </span>
      )}
      {isEditing && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="rounded-full p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
