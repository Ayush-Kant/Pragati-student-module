const fieldClass = (error) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-white outline-none transition ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  }`;

const StepPersonalInfo = ({ personal, contact, errors = {}, onPersonalChange, onContactChange }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name *</label>
          <input
            value={personal.name}
            onChange={(event) => onPersonalChange({ name: event.target.value })}
            className={fieldClass(errors.name)}
            placeholder="Your full name"
            autoComplete="name"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone number</label>
          <input
            value={personal.phone}
            onChange={(event) => onPersonalChange({ phone: event.target.value })}
            className={fieldClass(errors.phone)}
            placeholder="9876543210"
            autoComplete="tel"
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date of birth</label>
          <input
            type="date"
            value={personal.dateOfBirth}
            onChange={(event) => onPersonalChange({ dateOfBirth: event.target.value })}
            className={fieldClass(errors.dateOfBirth)}
          />
          {errors.dateOfBirth ? <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
          <select
            value={personal.gender}
            onChange={(event) => onPersonalChange({ gender: event.target.value })}
            className={fieldClass(false)}
          >
            <option value="">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Short bio</label>
        <textarea
          value={personal.bio}
          onChange={(event) => onPersonalChange({ bio: event.target.value })}
          rows={3}
          maxLength={2000}
          className={`${fieldClass(false)} resize-y`}
          placeholder="A brief introduction about yourself"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">College ID</label>
          <input
            value={contact.collegeId ?? ""}
            onChange={(event) => onContactChange({ collegeId: event.target.value })}
            className={fieldClass(errors.collegeId)}
            placeholder="Numeric College ID"
            inputMode="numeric"
          />
          {errors.collegeId ? <p className="mt-1 text-xs text-red-500">{errors.collegeId}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">City *</label>
          <input
            value={contact.city}
            onChange={(event) => onContactChange({ city: event.target.value })}
            className={fieldClass(errors.city)}
            placeholder="Pune"
            autoComplete="address-level2"
          />
          {errors.city ? <p className="mt-1 text-xs text-red-500">{errors.city}</p> : null}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">State</label>
          <input
            value={contact.state}
            onChange={(event) => onContactChange({ state: event.target.value })}
            className={fieldClass(false)}
            placeholder="Maharashtra"
            autoComplete="address-level1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pincode</label>
          <input
            value={contact.pincode}
            onChange={(event) => onContactChange({ pincode: event.target.value })}
            className={fieldClass(false)}
            placeholder="411001"
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </div>
      </div>
    </div>
  );
};

export default StepPersonalInfo;
