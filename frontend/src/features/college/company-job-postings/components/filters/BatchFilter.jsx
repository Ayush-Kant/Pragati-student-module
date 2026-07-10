import { BATCHES } from "../../constants/companyJobPostingConstants";

const BatchFilter = ({
  value = "",
  onChange,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    >
      <option value="">Batch</option>

      {BATCHES.map((batch) => (
        <option
          key={batch}
          value={batch}
        >
          {batch}
        </option>
      ))}
    </select>
  );
};

export default BatchFilter;