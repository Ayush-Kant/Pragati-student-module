function AssessmentTypeBadge({ type }) {
  const styles = {
    MCQ: "bg-blue-100 text-blue-700",
    Coding: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[type] || ""
      }`}
    >
      {type}
    </span>
  );
}

export default AssessmentTypeBadge;