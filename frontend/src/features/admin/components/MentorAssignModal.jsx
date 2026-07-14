import { useForm } from "react-hook-form";
import Modal from "react-modal";

Modal.setAppElement("#root");

const defaultMentors = [
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
];

const MentorAssignModal = ({
    isOpen,
    onClose,
    onAssign,
    mentors = defaultMentors,
    loading = false,
}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            mentorId: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose?.();
    };

    const submitHandler = (data) => {

        onAssign?.(data.mentorId);

        reset();

        handleClose();

    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto mt-32 shadow-xl outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
        >

            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Assign Mentor
            </h2>

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-5"
            >

                <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mentor
                    </label>

                    <select
                        {...register("mentorId", {
                            required: "Please select a mentor",
                        })}
                        className="
                            w-full
                            border
                            border-slate-300
                            rounded-xl
                            px-4
                            py-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-orange-400
                        "
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

                    {errors.mentorId && (

                        <p className="text-red-500 text-sm mt-2">
                            {errors.mentorId.message}
                        </p>

                    )}

                </div>

                <div className="flex justify-end gap-3 pt-3">

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
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
                        {loading
                            ? "Assigning..."
                            : "Assign Mentor"}
                    </button>

                </div>

            </form>

        </Modal>
    );
};

export default MentorAssignModal;