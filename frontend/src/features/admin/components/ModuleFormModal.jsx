import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ModuleFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    moduleData = null,
    loading = false,
}) => {
    const isEdit = Boolean(moduleData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            contentUrl: "",
            durationHours: "",
            order: "",
        },
    });

    useEffect(() => {
        if (moduleData) {
            reset({
                title: moduleData.title || "",
                contentUrl: moduleData.contentUrl || "",
                durationHours: moduleData.durationHours || "",
                order: moduleData.order || "",
            });
        } else {
            reset({
                title: "",
                contentUrl: "",
                durationHours: "",
                order: "",
            });
        }
    }, [moduleData, reset]);

    const handleClose = () => {
        reset();
        onClose?.();
    };

   const submitHandler = async (data) => {
  try {
    await onSubmit?.({
      ...data,
      durationHours: Number(data.durationHours),
      order: Number(data.order),
    });

    handleClose();
  } catch (error) {
    console.error("Failed to save module:", error);
  }
};

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className="bg-white rounded-2xl p-6 max-w-lg w-full mx-auto mt-20 shadow-xl outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-y-auto"
        >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {isEdit ? "Edit Module" : "Add Module"}
            </h2>

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-5"
            >
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Module Title
                    </label>

                    <input
                        type="text"
                        {...register("title", {
                            required: "Module title is required",
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />

                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                {/* Content URL */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Content URL
                    </label>

                    <input
                        type="url"
                        {...register("contentUrl", {
                            required: "Content URL is required",
                            pattern: {
                                value:
                                    /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i,
                                message: "Enter a valid URL",
                            },
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />

                    {errors.contentUrl && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.contentUrl.message}
                        </p>
                    )}
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Duration Hours
                    </label>

                    <input
                        type="number"
                        {...register("durationHours", {
                            required: "Duration is required",
                            min: {
                                value: 1,
                                message:
                                    "Duration must be greater than 0",
                            },
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />

                    {errors.durationHours && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.durationHours.message}
                        </p>
                    )}
                </div>

                {/* Order */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Module Order
                    </label>

                    <input
                        type="number"
                        {...register("order", {
                            required: "Order is required",
                            min: {
                                value: 1,
                                message:
                                    "Order must be greater than 0",
                            },
                        })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />

                    {errors.order && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.order.message}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-slate-300 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Module"
                                : "Add Module"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ModuleFormModal;