import { SlidersHorizontal } from "lucide-react";

const tabs = [
  "All",
  "Active",
  "Completed",
  "At Risk",
  "Recently Updated",
];

export default function FilterBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex gap-8 border-b">

        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`
              pb-3
              text-sm
              font-medium
              transition
              ${
                index === 0
                  ? "border-b-2 border-[#004ac6] text-[#004ac6]"
                  : "text-gray-600 hover:text-[#004ac6]"
              }
            `}
          >
            {tab}
          </button>
        ))}

      </div>

      <button className="flex items-center gap-2 text-gray-600 hover:text-[#004ac6]">

        <SlidersHorizontal className="w-4 h-4" />

        <span className="text-sm">
          Sort: Priority
        </span>

      </button>

    </div>
  );
}