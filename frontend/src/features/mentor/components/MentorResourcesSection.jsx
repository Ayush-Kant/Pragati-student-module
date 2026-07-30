import { GraduationCap } from "lucide-react";

export default function MentorResourcesSection() {
  return (
    <div
      class="
  rounded-3xl
  bg-gradient-to-br
  from-[#16181d]
  via-[#0d1016]
  to-[#05070a]
  text-white
  p-6
  overflow-hidden
  relative
"
    >
      <GraduationCap
        className="
          absolute
          right-5
          top-5
          w-20
          h-20
          text-white/10
        "
      />

      <h2 className="text-xl font-semibold">
        Mentor Resources
      </h2>

      <p className="mt-3 text-sm text-white/70 leading-6">
        Access premium training modules and curriculum templates for
        enterprise projects.
      </p>

      <button
  className="
    w-full
    mt-5
    bg-[#004AC6]
    text-white
    py-3
    rounded-full
    hover:bg-[#00379e]
    transition
  "
>
  Browse Catalog
</button>
    </div>
  );
}