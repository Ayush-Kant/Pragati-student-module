export default function FillBlankInput({ value = "", onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">Your answer</label>
      <input
        type="text"
        value={value}
        maxLength={500}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type your answer..."
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <p className="mt-2 text-xs text-slate-400">Maximum 500 characters.</p>
    </div>
  );
}
