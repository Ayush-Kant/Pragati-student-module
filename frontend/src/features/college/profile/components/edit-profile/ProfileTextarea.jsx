const ProfileTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          px-4
          py-3
          border
          border-gray-300
          rounded-lg
          text-sm
          resize-none
          outline-none
          focus:ring-2
          focus:ring-orange-400
          focus:border-orange-400
        "
      />
    </div>
  );
};

export default ProfileTextarea;