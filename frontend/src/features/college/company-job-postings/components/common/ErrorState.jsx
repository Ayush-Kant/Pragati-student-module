import { AlertTriangle } from "lucide-react";

const ErrorState = ({ message, darkMode }) => {
  return (
    <div className={`rounded-xl p-8 text-center ${darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-300'}`}>

      <AlertTriangle
        className="mx-auto mb-3 text-red-500"
        size={48}
      />

      <h2 className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
        {message}
      </h2>

    </div>
  );
};

export default ErrorState;