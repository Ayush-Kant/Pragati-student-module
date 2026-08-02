const AssessmentTypeBadge = ({ type }) => {
  const styles = {
    MCQ:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

    Coding:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full
        px-2 py-1 md:px-3
        text-xs md:text-sm
        font-semibold
        transition-colors duration-300
        ${
          styles[type] ||
          "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
        }`}
    >
      {type}
    </span>
  );
};

export default AssessmentTypeBadge;