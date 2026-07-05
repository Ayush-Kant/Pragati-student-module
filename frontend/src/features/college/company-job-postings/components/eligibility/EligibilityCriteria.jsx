const EligibilityCriteria = ({ job }) => {
  if (!job) return null;

  return (
    <div>
      <h3>Eligibility Criteria</h3>

      <p>Department: {job.department || "N/A"}</p>

      <p>Course: {job.course || "N/A"}</p>

      <p>Batch: {job.batch}</p>

      <p>CGPA: {job.cgpa}</p>
    </div>
  );
};

export default EligibilityCriteria;