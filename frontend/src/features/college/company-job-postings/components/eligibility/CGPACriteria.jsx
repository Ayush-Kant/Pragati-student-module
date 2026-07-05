const CGPACriteria = ({ cgpa }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">CGPA Criteria</h3>
      <p>Minimum CGPA : {cgpa}</p>
    </div>
  );
};

export default CGPACriteria;