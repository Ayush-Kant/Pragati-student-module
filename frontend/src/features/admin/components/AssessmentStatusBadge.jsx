function AssessmentStatusBadge({ status }) {
  const styles = {
    draft: "bg-orange-100 text-orange-700",
    active: "bg-green-100 text-green-700",
    archived: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status] || ""
      }`}
    >
      {status}
    </span>
  );
}

export default AssessmentStatusBadge;