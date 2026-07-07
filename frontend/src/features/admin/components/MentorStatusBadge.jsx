export default function MentorStatusBadge({
  isActive,
  onToggle = () => {},
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${
          isActive ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}