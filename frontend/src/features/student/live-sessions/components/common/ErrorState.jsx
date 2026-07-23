export default function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <span className="text-2xl" aria-hidden="true">
        ⚠️
      </span>
      <h3 className="text-sm font-semibold text-red-700">{title}</h3>
      <p className="max-w-sm text-sm text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}
