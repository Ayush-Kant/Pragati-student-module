import SearchStudent from "./SearchStudent";
import DepartmentFilter from "./DepartmentFilter";
import CourseFilter from "./CourseFilter";
import BatchFilter from "./BatchFilter";
import StatusFilter from "./StatusFilter";

export default function StudentFilters(props) {
  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">

      <div className="flex flex-wrap gap-4">

        <SearchStudent
          search={props.search}
          setSearch={props.setSearch}
        />

        <DepartmentFilter
          department={props.department}
          setDepartment={props.setDepartment}
        />

        <CourseFilter
          course={props.course}
          setCourse={props.setCourse}
        />

        <BatchFilter
          batch={props.batch}
          setBatch={props.setBatch}
        />

        <StatusFilter
          status={props.status}
          setStatus={props.setStatus}
        />

      </div>

    </div>
  );
}