const ValidationAlert = ({ message, onClose }) => {
  return (
    <div className="mb-5 flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
      <span className="text-sm font-medium">
        {message}
      </span>

      <button
        onClick={onClose}
        className="text-red-500 font-bold"
      >
        ×
      </button>
    </div>
  );
};

export default ValidationAlert;