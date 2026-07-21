import { useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

Modal.setAppElement("#root");

const programSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required"),

    targetRole: z
        .string()
        .min(1, "Target role is required"),

    description: z.string().optional(),

    durationWeeks: z.coerce
        .number()
        .gt(0, "Duration must be greater than 0"),

    mentorId: z.string().optional(),
});

const ProgramEditModal = ({
    isOpen,
    onClose,
    onSubmit,
    programData,
    mentors = [
        {
            id: "mentor_001",
            name: "Rohit Sharma",
        },
        {
            id: "mentor_002",
            name: "Priya Singh",
        },
        {
            id: "mentor_003",
            name: "Arjun Das",
        },
        {
            id: "mentor_004",
            name: "Sneha Verma",
        },
        {
            id: "mentor_005",
            name: "Rahul Kumar",
        },
    ],
    loading = false,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(programSchema),
        defaultValues: {
            title: "",
            targetRole: "",
            description: "",
            durationWeeks: "",
            mentorId: "",
        },
    });

    useEffect(() => {
        if (programData) {
            reset({
                title: programData.title || "",
                targetRole: programData.targetRole || "",
                description: programData.description || "",
                durationWeeks: programData.durationWeeks || "",
                mentorId: programData.mentor?.id || "",
            });
        }
    }, [programData, reset]);

    const handleClose = () => {

    reset();

    onClose?.();

};
 const submitHandler = async (data) => {
  try {
    await onSubmit?.({
      ...programData,
      ...data,
    });

    handleClose();
  } catch (error) {
    console.error("Failed to update program:", error);
  }
};

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-auto mt-16 shadow-xl outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-y-auto p-4"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Edit Program
            </h2>

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-5"
            >
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        {...register("title")}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    />

                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                {/* Target Role */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target Role
                    </label>

                    <input
                        type="text"
                        {...register("targetRole")}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    />

                    {errors.targetRole && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.targetRole.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        {...register("description")}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration (Weeks)
                    </label>

                    <input
                        type="number"
                        {...register("durationWeeks")}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    />

                    {errors.durationWeeks && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.durationWeeks.message}
                        </p>
                    )}
                </div>

                {/* Mentor */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mentor
                    </label>

                    <select
                        {...register("mentorId")}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                        <option value="">
                            Select Mentor
                        </option>

                        {mentors.map((mentor) => (
                            <option
                                key={mentor.id}
                                value={mentor.id}
                            >
                                {mentor.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="
px-6
py-3
rounded-xl
border
border-slate-300
hover:bg-slate-100
font-medium
transition-all
duration-300
"
                    >
                        Cancel
                    </button>

                    <button
    type="submit"
    disabled={loading}
    className="
        bg-orange-500
        hover:bg-orange-600
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        shadow-md
        transition-all
        duration-300
    "
>
    {loading ? "Updating..." : "Update Program"}
</button>
                </div>
            </form>
        </Modal>
    );
};

export default ProgramEditModal;