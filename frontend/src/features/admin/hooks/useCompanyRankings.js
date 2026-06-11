import { useEffect, useState } from "react";
import { getCompanyRankings } from "../services/companyService";

export default function useCompanyRankings() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRankings = async () => {
        try {
            setLoading(true);

            const data = await getCompanyRankings();

            setRankings(data);
        } catch (error) {
            console.error(
                "Error fetching company rankings:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    return {
        rankings,
        loading,
        fetchRankings,
    };
}