import { Search } from "lucide-react";

const RECIPIENT_OPTIONS = [
  { label: "Students", value: "students" },
  { label: "Colleges", value: "colleges" },
  { label: "Companies", value: "companies" },
];

const RecipientSelector = ({ value, onChange }) => {
  const selectedGroups = value?.groups || [];
  const specificUser = value?.specificUser || "";

  const handleGroupChange = (group) => {
    const updatedGroups = selectedGroups.includes(group)
      ? selectedGroups.filter((item) => item !== group)
      : [...selectedGroups, group];

    onChange({
      ...value,
      groups: updatedGroups,
    });
  };

  const handleUserChange = (event) => {
    onChange({
      ...value,
      specificUser: event.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recipients</h3>

        <div className="space-y-2">
          {RECIPIENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGroups.includes(option.value)}
                onChange={() => handleGroupChange(option.value)}
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Specific User
        </label>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={specificUser}
            onChange={handleUserChange}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientSelector;
