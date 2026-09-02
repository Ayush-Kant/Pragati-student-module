import SkillTagSelector from "../../../components/profile/SkillTagSelector";

const StepSkills = ({ skills = [], onChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">What are you comfortable working with?</h3>
        <p className="text-xs text-slate-400 mt-1">Add a few technologies, tools, or competencies. You can change these later from your profile.</p>
      </div>
      <SkillTagSelector skills={skills} onChange={onChange} />
    </div>
  );
};

export default StepSkills;
