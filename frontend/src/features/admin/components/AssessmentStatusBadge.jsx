const AssessmentStatusBadge = ({
  status,
}) => {
  const styles = {
    Draft:
      "bg-orange-100 text-orange-700",
    Active:
      "bg-green-100 text-green-700",
    Archived:
      "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        styles[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default AssessmentStatusBadge;