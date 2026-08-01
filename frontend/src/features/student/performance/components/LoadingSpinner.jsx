const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;