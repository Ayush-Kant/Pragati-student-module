import { useEffect, useState } from "react";
// import {
//     mockStudentDetail,
//     mockProgress,
// } from "../adminStudentMockData";

const useStudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStudentDetail = async () => {
        try {
            setLoading(true);
            setError("");

            // MOCK DATA
            setStudent(mockStudentDetail);
            setDrives(mockProgress.drives);

            // FUTURE API
            // const studentData = await getStudentById(id);
            // const progressData = await getStudentProgress(id);

            // setStudent(studentData);
            // setDrives(progressData.drives);

        } catch (err) {
            setError("Failed to load student details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentDetail();
    }, []);

    return {
        student,
        drives,
        loading,
        error,
        refetch: fetchStudentDetail,
    };
};

export default useStudentDetail;
