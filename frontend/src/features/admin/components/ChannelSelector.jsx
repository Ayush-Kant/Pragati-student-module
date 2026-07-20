const CHANNEL_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "In-App", value: "in-app" },
];

const ChannelSelector = ({ value = [], onChange }) => {
  const handleChannelChange = (channel) => {
    const updatedChannels = value.includes(channel)
      ? value.filter((item) => item !== channel)
      : [...value, channel];

    onChange(updatedChannels);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">
        Notification Channels
      </h3>

      <div className="space-y-2">
        {CHANNEL_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => handleChannelChange(option.value)}
            />

            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelector;