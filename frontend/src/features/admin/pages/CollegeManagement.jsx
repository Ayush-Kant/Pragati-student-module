import { useState } from "react";
import { mockColleges } from "../mockCollegeData";
import CollegeTable from "../components/CollegeTable";

export default function CollegeManagement() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [department, setDepartment] = useState("");

    const filteredColleges = mockColleges.filter((college) => {
        return (
            (college.name.toLowerCase().includes(search.toLowerCase()) ||
                college.email.toLowerCase().includes(search.toLowerCase()) ||
                college.location.toLowerCase().includes(search.toLowerCase()))
            &&
            (status === "all" || college.status === status)
            &&
            (department === "" ||
                college.departments.some((dept) =>
                    dept.toLowerCase()
                        .includes(department.toLowerCase())
                )
            )
        )
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">
                College Management
            </h1>
            <p className="text-gray-500 mb-6">
                Approve institutions, monitor placement performance
            </p>
            {/* Search + Filters */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search college..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                </select>
                {/* Department */}
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>
            <div className="mt-6">
                <p className="font-semibold mb-3">
                    Showing {filteredColleges.length} colleges
                </p>
                <CollegeTable
                    colleges={filteredColleges}
                />
            </div>
        </div>
    );
}
