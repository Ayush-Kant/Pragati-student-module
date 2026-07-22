import { Inbox } from "lucide-react";

const EmptyState = ({ message = "No Data Found", darkMode }) => {
  return (
    <div className={`rounded-xl shadow-md p-12 text-center ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>
      <Inbox
        size={60}
        className={`mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}
      />

      <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-700'}`}>
        {message}
      </h2>
    </div>
  );
};

export default EmptyState;