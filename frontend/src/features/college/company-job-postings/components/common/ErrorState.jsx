import { AlertTriangle } from "lucide-react";

const ErrorState = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-300 rounded-xl p-8 text-center">

      <AlertTriangle
        className="mx-auto text-red-500 mb-3"
        size={48}
      />

      <h2 className="text-red-700 font-semibold">
        {message}
      </h2>

    </div>
  );
};

export default ErrorState;