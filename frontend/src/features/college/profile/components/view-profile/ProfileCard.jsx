import { useOutletContext } from 'react-router-dom';

export default function ProfileCard({ title, children }) {
  const { darkMode } = useOutletContext() || {};

  return (
    <div className={`rounded-xl border overflow-hidden ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-100 shadow-sm"
    }`}>
      {title && (
        <div className={`border-b px-6 py-4 ${
          darkMode
            ? "border-[#3D3D3D] bg-[#333333]"
            : "border-gray-100 bg-gray-50/50"
        }`}>
          <h3 className={`text-sm font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
