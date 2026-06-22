import { useState } from "react";

export default function DriveCreateModal({
    onClose,
    addDrive
}) {

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        minGPA: "",
        requiredSkills: "",
        maxOpenings: "",
        deadline: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const newDrive = {
            id: `drive_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            title: formData.title,
            company: { name: formData.company },
            status: "active",
            currentStage: "screening",
            candidates: Number(formData.maxOpenings),
            minGPA: parseFloat(formData.minGPA) || 0,
            requiredSkills: formData.requiredSkills,
            maxOpenings: parseInt(formData.maxOpenings, 10) || 0,
            deadline: formData.deadline,
        };

        addDrive(newDrive);
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
                    />

                    <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                    />

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