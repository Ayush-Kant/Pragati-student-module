export default function TrainerFilter({ value, onChange, options = ["All"] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      aria-label="Filter by trainer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "All" ? "All Trainers" : opt}
        </option>
      ))}
    </select>
  );
}
