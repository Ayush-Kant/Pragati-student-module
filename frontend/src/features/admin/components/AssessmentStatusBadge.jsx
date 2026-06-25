const AssessmentStatusBadge = ({ status }) => {
  const styles = {
    Draft:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",

    Active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

    Archived:
      "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-300 ${
        styles[status] ||
        "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
      }`}
    >
      {status}
    </span>
  );
};

export default AssessmentStatusBadge;