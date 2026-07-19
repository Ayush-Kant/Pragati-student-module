const SchedulePicker = ({ value, onChange }) => {
  const schedule = value || {
    type: "now",
    date: "",
  };

  const handleTypeChange = (type) => {
    onChange({
      ...schedule,
      type,
    });
  };

  const handleDateChange = (event) => {
    onChange({
      ...schedule,
      date: event.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">
        Delivery Schedule
      </h3>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="schedule"
            checked={schedule.type === "now"}
            onChange={() => handleTypeChange("now")}
          />

          <span>Send Now</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="schedule"
            checked={schedule.type === "schedule"}
            onChange={() => handleTypeChange("schedule")}
          />

          <span>Schedule</span>
        </label>
      </div>

      {schedule.type === "schedule" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Scheduled Date & Time
          </label>

          <input
            type="datetime-local"
            value={schedule.date}
            onChange={handleDateChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default SchedulePicker;