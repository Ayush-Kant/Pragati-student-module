import { useState, useEffect, useCallback } from "react";
import { adminService } from "../services/adminService";

const useTrainingProgramDetail = (programId) => {

    const [program, setProgram] = useState(null);

    const [analytics, setAnalytics] = useState({
        totalModules: 0,
        enrolledStudents: 0,
        completionRate: "0%",
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    /* =====================================
            Fetch Training Program
    ===================================== */

    const fetchProgram = useCallback(async () => {

        if (!programId) return;

        try {

            setLoading(true);

            setError(null);

            const response =
                await adminService.getTrainingProgramById(programId);

            const data = response?.data || response;

            setProgram(data);

            setAnalytics({
                totalModules:
                    data?.modulesCount ||
                    data?.modules?.length ||
                    0,

                enrolledStudents:
                    data?.enrollment || 0,

                completionRate:
                    data?.completionRate || "0%",
            });

        } catch (err) {

            console.error(
                "Failed to fetch training program:",
                err
            );

            setError(err);

        } finally {

            setLoading(false);

        }

    }, [programId]);

    /* =====================================
            Initial Load
    ===================================== */

    useEffect(() => {

        fetchProgram();

    }, [fetchProgram]);

    /* =====================================
            Return
    ===================================== */

    return {

        program,

        analytics,

        loading,

        error,

        refetch: fetchProgram,

    };

};

export default useTrainingProgramDetail;