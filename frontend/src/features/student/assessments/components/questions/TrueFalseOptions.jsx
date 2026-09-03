export default function TrueFalseOptions({ options = [], value, onChange }) {
  const normalized = options.length ? options : [
    { id: "option_0", text: "True" },
    { id: "option_1", text: "False" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {normalized.map((option) => {
        const selected = String(value) === String(option.text).toLowerCase();
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.text.toLowerCase() === "true")}
            className={`rounded-xl border p-4 text-left font-semibold transition ${selected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"}`}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
}
