import {
  MoreVertical,
  ClipboardList,
  AlarmClock,
  Pencil,
} from "lucide-react";

export default function ProjectCard({
  title,
  status,
  progress,
  students,
  tasks,
  deadline,
  avatars = [],
  showIssuesButton = false,
}) {
  const isActive = status === "active";

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        p-6
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {isActive ? "ACTIVE" : "AT RISK"}
        </span>

        <button className="text-gray-500 hover:text-black transition">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#141b2b] mt-5 leading-snug">
        {title}
      </h2>

      {/* Students */}
      <div className="flex items-center gap-3 mt-5">
        <div className="flex -space-x-2">
          {avatars.slice(0, 2).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}

          {students > 2 && (
            <div
              className="
                w-8
                h-8
                rounded-full
                bg-[#E8ECFF]
                border-2
                border-white
                flex
                items-center
                justify-center
                text-xs
                font-semibold
                text-[#141b2b]
              "
            >
              +{students - 2}
            </div>
          )}
        </div>

        <p className="text-gray-500 text-[15px]">
          {students} Students Enrolled
        </p>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium tracking-wide">
            PROGRESS
          </span>

          <span className="font-semibold">
            {progress}%
          </span>
        </div>

        <div className="w-full h-2 bg-[#EDF1F7] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isActive ? "bg-[#004AC6]" : "bg-orange-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-7 text-sm">
        <div
          className={`flex items-center gap-2 font-medium ${
            isActive ? "text-gray-600" : "text-red-600"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>{tasks} Tasks</span>
        </div>

        <div
          className={`flex items-center gap-2 font-medium ${
            isActive ? "text-gray-600" : "text-red-600"
          }`}
        >
          <AlarmClock className="w-4 h-4" />
          <span>{deadline}</span>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          className={`flex-1 py-3 rounded-full font-medium transition ${
            showIssuesButton
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[#F3F5FB] hover:bg-gray-200 text-[#141b2b]"
          }`}
        >
          {showIssuesButton ? "View Issues" : "View"}
        </button>

        <button
          className="
            flex-1
            py-3
            rounded-full
            bg-[#F3F5FB]
            hover:bg-gray-200
            text-[#141b2b]
            font-medium
            transition
          "
        >
          Analytics
        </button>

        <button
          className="
            w-12
            h-12
            rounded-full
            border
            border-gray-300
            flex
            items-center
            justify-center
            hover:bg-gray-100
            transition
          "
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}