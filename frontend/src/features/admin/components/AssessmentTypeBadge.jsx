const AssessmentTypeBadge = ({
  type,
}) => {
  const styles = {
    MCQ:
      "bg-blue-100 text-blue-700",

    Coding:
      "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        styles[type] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {type}
    </span>
  );
};

export default AssessmentTypeBadge;