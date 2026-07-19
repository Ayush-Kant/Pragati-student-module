import { useParams } from "react-router-dom";
import { mockColleges } from "../mockCollegeData";

function useCollegeDetail() {
    const { id } = useParams();
    const college =
        mockColleges.find(
            (college) =>
                college.collegeId === Number(id)
        );
    return {
        college
    };
}

export default useCollegeDetail;