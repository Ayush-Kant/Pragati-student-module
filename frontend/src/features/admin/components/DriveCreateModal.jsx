import { useState, useEffect } from "react";
import { getCompanies } from "../services/companyService";

export default function DriveCreateModal({
    onClose,
    addDrive
}) {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        minGPA: "",
        requiredSkills: "",
        maxOpenings: "",
        deadline: ""
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const list = await getCompanies();
                setCompanies(list);
                if (list.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        company: String(list[0].id)
                    }));
                }
            } catch (err) {
                console.error("Error loading companies for drive creation:", err);
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCompany = companies.find(c => String(c.id) === String(formData.company));
        const newDrive = {
            id: `drive_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            title: formData.title,
            company: selectedCompany ? { id: selectedCompany.id, name: selectedCompany.name } : { name: "" },
            status: "active",
            currentStage: "screening",
            candidates: Number(formData.maxOpenings),
            minGPA: parseFloat(formData.minGPA) || 0,
            requiredSkills: formData.requiredSkills,
            maxOpenings: parseInt(formData.maxOpenings, 10) || 0,
            deadline: formData.deadline,
        };

        addDrive(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-125">
                <h2 className="text-xl font-bold mb-4">
                    Create Drive
                </h2>
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Drive Title"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="company"
                        value={formData.company}
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Company</option>
                        {companies.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="minGPA"
                        placeholder="Minimum GPA"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="requiredSkills"
                        placeholder="Required Skills"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="maxOpenings"
                        placeholder="Max Openings"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="deadline"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                    />

                    <div className="flex gap-3">

                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Create Drive
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}