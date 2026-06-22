export default function DriveStageBadge({ stage }) {

  const colors = {
    screening: "bg-yellow-100 text-yellow-700",
    training: "bg-purple-100 text-purple-700",
    shortlist: "bg-indigo-100 text-indigo-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[stage]}`}>
      {stage}
    </span>
  );
}