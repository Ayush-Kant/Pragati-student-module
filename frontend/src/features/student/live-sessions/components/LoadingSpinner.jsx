// LoadingSpinner.jsx
const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="h-10 w-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default LoadingSpinner;
