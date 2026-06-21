import "./../styles/collegeParticipationTable.css";

const CollegeParticipationTable = ({ data }) => {
  return (
    <div className="college-table-card">
      <div className="card-header">
        <h2>College Participation</h2>
      </div>

      <div className="college-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>College</th>
              <th>Candidates</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((college, index) => (
              <tr key={index}>
                <td>{college.name}</td>

                <td>{college.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeParticipationTable;