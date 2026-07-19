import { actionsData, dangerAction } from "../../types/profileExtraDummyData";

const ActionCard = ({ icon: Icon, title, primary = false }) => (
  <button
    className={`
      group flex items-center gap-5
      rounded-2xl border p-3
      transition-all duration-300
      text-left
      ${
        primary
          ? "border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          : "border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      }
    `}
  >
    <div
      className={`
        flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
        ${
          primary
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
            : "bg-gray-100 text-gray-600"
        }
      `}
    >
      <Icon size={16} />
    </div>

    <span className="text-sm font-medium text-gray-800">{title}</span>
  </button>
);

const ProfileActions = () => {
  const DangerIcon = dangerAction.icon;

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border border-gray-100
        bg-white
        shadow-xl shadow-gray-200/40
      "
    >
      {/* Top Accent */}
      <div
        className="
          h-2
          bg-gradient-to-r
          from-blue-500
          via-indigo-500
          to-violet-500
        "
      />

      <div className="p-6">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>

          <p className="mt-1 text-xs text-gray-400">
            Manage and share your profile
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {actionsData.map((action) => (
            <ActionCard
              key={action.title}
              icon={action.icon}
              title={action.title}
              primary={action.primary}
            />
          ))}
        </div>

        {/* Danger Zone */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-red-600">
            Danger Zone
          </h3>
          
          <button
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-100 hover:border-red-300"
          >
            <DangerIcon size={16} />
            {dangerAction.title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileActions;
