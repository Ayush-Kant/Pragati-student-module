import { useNavigate } from "react-router-dom";
import CompanyStatusBadge from "./CompanyStatusBadge";

export default function ActiveDrivesTable({ drives, darkMode }) {
    const navigate = useNavigate();

    const formatDate = (date) =>
        new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    return (
        <div className={`overflow-x-auto rounded-lg shadow ${darkMode
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-900"
            }`}>
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-left">
                            Company
                        </th>

                        <th className="p-3 text-left">
                            Status
                        </th>

                        <th className="p-3 text-left">
                            Drive Name
                        </th>

                        <th className="p-3 text-left">
                            Dates
                        </th>

                        <th className="p-3 text-left">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {drives.map((drive) => (
                        <tr key={drive.id} className="border-b">
                            <td className="p-3">
                                {drive.companyName}
                            </td>

                            <td className="p-3">
                                <CompanyStatusBadge
                                    status={drive.companyStatus}
                                />
                            </td>

                            <td className="p-3">
                                {drive.driveName}
                            </td>

                            <td className="p-3">
                                {formatDate(drive.startDate)}&nbsp;
                                -
                                &nbsp;{formatDate(drive.endDate)}
                            </td>

                            <td className="p-3">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/companies/${drive.companyId}`
                                        )
                                    }
                                    className="px-3 py-1 border rounded cursor-pointer"
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}