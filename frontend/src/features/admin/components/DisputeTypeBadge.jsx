const TYPE_COLORS = {
  "mentor issue":
    "bg-indigo-100 text-indigo-700",

  payment:
    "bg-green-100 text-green-700",

  attendance:
    "bg-pink-100 text-pink-700",

  assessment:
    "bg-yellow-100 text-yellow-700",
};

const DisputeTypeBadge = ({ type }) => {
  const key = type?.toLowerCase() || "";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        TYPE_COLORS[key] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {type}
    </span>
  );
};

export default DisputeTypeBadge;