const fieldClass = (error) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-white outline-none transition ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  }`;

const StepAcademics = ({ academic, errors = {}, onChange }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Institution</label>
          <input
            value={academic.institutionName}
            onChange={(event) => onChange({ institutionName: event.target.value })}
            className={fieldClass(false)}
            placeholder="College / university name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department *</label>
          <input
            value={academic.department}
            onChange={(event) => onChange({ department: event.target.value })}
            className={fieldClass(errors.department)}
            placeholder="Computer Science"
          />
          {errors.department ? <p className="mt-1 text-xs text-red-500">{errors.department}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course</label>
          <input
            value={academic.course}
            onChange={(event) => onChange({ course: event.target.value })}
            className={fieldClass(false)}
            placeholder="B.Tech"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Degree</label>
          <input
            value={academic.degree}
            onChange={(event) => onChange({ degree: event.target.value })}
            className={fieldClass(false)}
            placeholder="Bachelor's degree"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Semester</label>
          <input
            type="number"
            min="1"
            max="20"
            value={academic.semester}
            onChange={(event) => onChange({ semester: event.target.value })}
            className={fieldClass(errors.semester)}
            placeholder="6"
          />
          {errors.semester ? <p className="mt-1 text-xs text-red-500">{errors.semester}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">CGPA</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={academic.cgpa}
            onChange={(event) => onChange({ cgpa: event.target.value })}
            className={fieldClass(errors.cgpa)}
            placeholder="8.50"
          />
          {errors.cgpa ? <p className="mt-1 text-xs text-red-500">{errors.cgpa}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Admission year</label>
          <input
            type="number"
            min="1900"
            max="2200"
            value={academic.admissionYear}
            onChange={(event) => onChange({ admissionYear: event.target.value })}
            className={fieldClass(false)}
            placeholder="2022"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Graduation year</label>
          <input
            type="number"
            min="1900"
            max="2200"
            value={academic.graduationYear}
            onChange={(event) => onChange({ graduationYear: event.target.value })}
            className={fieldClass(errors.graduationYear)}
            placeholder="2026"
          />
          {errors.graduationYear ? <p className="mt-1 text-xs text-red-500">{errors.graduationYear}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Academic email</label>
          <input
            type="email"
            value={academic.academicEmail}
            onChange={(event) => onChange({ academicEmail: event.target.value })}
            className={fieldClass(false)}
            placeholder="student@college.edu"
          />
        </div>
      </div>
    </div>
  );
};

export default StepAcademics;
