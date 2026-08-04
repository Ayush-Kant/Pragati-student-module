const ErrorState = ({
  message = "Something went wrong while loading performance data.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12">
      <div className="text-6xl">⚠️</div>

      <h2 className="mt-4 text-xl font-semibold text-red-600">
        Error
      </h2>

      <p className="mt-2 text-center text-red-500">
        {message}
      </p>
    </div>
  );
};

export default ErrorState;