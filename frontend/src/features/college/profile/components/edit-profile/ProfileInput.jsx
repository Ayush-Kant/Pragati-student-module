const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  options = [],
  icon = null
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <div className="relative">
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="
              w-full
              px-4
              py-2.5
              border
              border-gray-300
              rounded-lg
              text-sm
              outline-none
              focus:ring-2
              focus:ring-orange-400
              focus:border-orange-400
              appearance-none
              bg-white
            "
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`
              w-full
              px-4
              py-2.5
              border
              border-gray-300
              rounded-lg
              text-sm
              outline-none
              focus:ring-2
              focus:ring-orange-400
              focus:border-orange-400
              ${icon ? "pr-10" : ""}
            `}
          />
        )}

        {type === "select" && (
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        )}

        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInput;