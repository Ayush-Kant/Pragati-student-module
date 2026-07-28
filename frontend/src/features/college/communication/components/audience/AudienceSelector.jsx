import { useOutletContext } from "react-router-dom";

const AudienceSelector = ({
  value = [],
  onChange,
  options = [],
}) => {
  const { darkMode } = useOutletContext();

  const handleChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    onChange?.(selected);
  };

  return (
    <div>
      <label className="mb-2 block font-medium">
        Audience
      </label>

      <select
        multiple
        value={value}
        onChange={handleChange}
        className={`w-full min-h-[140px] rounded-2xl border px-4 py-3 ${
          darkMode
            ? "border-slate-700 bg-[#151D30] text-white"
            : "border-slate-300 bg-white text-slate-800"
        }`}
      >
        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs text-slate-500">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple audiences.
      </p>
    </div>
  );
};

export default AudienceSelector;