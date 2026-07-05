import { GraduationCap } from "lucide-react";

const EligibilityCard = ({ job }) => {
  return (
    <div className="bg-slate-50 rounded-xl p-5 border">

      <div className="flex items-center gap-2 mb-4">

        <GraduationCap
          className="text-blue-600"
        />

        <h3 className="font-semibold text-lg">
          Eligibility
        </h3>

      </div>

      <div className="space-y-2 text-slate-700">

        <p>
          <strong>Batch :</strong> {job.batch}
        </p>

        <p>
          <strong>CGPA :</strong> {job.cgpa}
        </p>

      </div>

    </div>
  );
};

export default EligibilityCard;