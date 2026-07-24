export default function SearchSession({ value, onChange, placeholder = "Search sessions or trainers…" }) {
  return (
    <div className="relative w-full sm:w-64">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}
