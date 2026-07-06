const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

export default LoadingSpinner;
