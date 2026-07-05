import { useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

Modal.setAppElement("#root");

const programSchema = z.object({

  title: z
    .string()
    .min(1, "Program title is required"),

  targetRole: z
    .string()
    .min(1, "Target role is required"),

  description: z.string().optional(),

  durationWeeks: z.coerce
    .number()
    .min(1, "Duration must be greater than 0"),

  mentorId: z.string().optional(),

  status: z
    .string()
    .min(1, "Status is required"),

});

const ProgramCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
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

    formState: {
      errors,
    },

  } = useForm({

    resolver: zodResolver(programSchema),

    defaultValues: {

      title: "",

      targetRole: "",

      description: "",

      durationWeeks: "",

      mentorId: "",

      status: "draft",

    },

  });

  useEffect(() => {

    if (isOpen) {

      reset();

    }

  }, [isOpen, reset]);

  const handleClose = () => {

    reset();

    onClose?.();

  };

  const submitHandler = (data) => {

    onSubmit?.(data);

    handleClose();

  };
  return (
  <Modal
    isOpen={isOpen}
    onRequestClose={handleClose}
    className="
      bg-white
      rounded-2xl
      w-[760px]
      max-w-[95vw]
      shadow-2xl
      outline-none
      mx-auto
      mt-10
      overflow-hidden
    "
    overlayClassName="
      fixed
      inset-0
      bg-black/50
      flex
      justify-center
      items-start
      z-50
      overflow-y-auto
      p-4
    "
  >

    {/* Header */}

    <div className="flex items-center justify-between px-8 py-6 border-b">

      <div>

        <h2 className="text-3xl font-bold text-slate-900">

          Create Training Program

        </h2>

        <p className="text-slate-500 mt-1">

          Add a new learning program.

        </p>

      </div>

      <button
        type="button"
        onClick={handleClose}
        className="
          h-10
          w-10
          rounded-xl
          border
          border-slate-200
          hover:bg-slate-100
          text-2xl
        "
      >
        ×
      </button>

    </div>

    <form
      onSubmit={handleSubmit(submitHandler)}
      className="px-8 py-6 space-y-5"
    >

      {/* Program Title */}

      <div>

        <label className="block text-sm font-semibold text-slate-700 mb-2">

          Program Title

        </label>

        <input
          type="text"
          placeholder="MERN Full Stack"
          {...register("title")}
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            focus:ring-2
            focus:ring-orange-400
            outline-none
          "
        />

        {errors.title && (

          <p className="text-red-500 text-sm mt-1">

            {errors.title.message}

          </p>

        )}

      </div>

      {/* Target Role + Duration */}

      <div className="grid grid-cols-2 gap-5">

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Target Role

          </label>

          <input
            type="text"
            placeholder="App Developer"
            {...register("targetRole")}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              focus:ring-2
              focus:ring-orange-400
              outline-none
            "
          />

          {errors.targetRole && (

            <p className="text-red-500 text-sm mt-1">

              {errors.targetRole.message}

            </p>

          )}

        </div>

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Duration (Weeks)

          </label>

          <input
            type="number"
            placeholder="6"
            {...register("durationWeeks")}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              focus:ring-2
              focus:ring-orange-400
              outline-none
            "
          />

          {errors.durationWeeks && (

            <p className="text-red-500 text-sm mt-1">

              {errors.durationWeeks.message}

            </p>

          )}

        </div>

      </div>
            {/* Description */}

      <div>

        <label className="block text-sm font-semibold text-slate-700 mb-2">

          Description

        </label>

        <textarea
          rows={3}
          placeholder="Brief description of the training program..."
          {...register("description")}
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            resize-none
            focus:ring-2
            focus:ring-orange-400
            outline-none
          "
        />

      </div>

      {/* Mentor + Program Status */}

      <div className="grid grid-cols-2 gap-5">

        {/* Mentor */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Mentor

          </label>

          <select
            {...register("mentorId")}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              focus:ring-2
              focus:ring-orange-400
              outline-none
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

        </div>

        {/* Program Status */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Program Status

          </label>

          <select
            {...register("status")}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              focus:ring-2
              focus:ring-orange-400
              outline-none
            "
          >

            <option value="draft">

              Draft

            </option>

            <option value="active">

              Active

            </option>

            <option value="inactive">

              Inactive

            </option>

          </select>

          {errors.status && (

            <p className="text-red-500 text-sm mt-1">

              {errors.status.message}

            </p>

          )}

        </div>

      </div>

      <hr className="border-slate-200" />
            {/* Buttons */}

      <div className="flex justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={handleClose}
          className="
            px-6
            py-3
            rounded-xl
            border
            border-slate-300
            bg-white
            text-slate-700
            font-medium
            hover:bg-slate-100
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
            px-6
            py-3
            rounded-xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            font-semibold
            shadow-md
            transition-all
            duration-300
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Creating..."
            : "Create Program"}
        </button>

      </div>

    </form>

  </Modal>

);

};

export default ProgramCreateModal;